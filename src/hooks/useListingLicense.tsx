import { toast } from 'react-hot-toast'
import { FACTORY_ADDR, EthereumMsg } from 'src/config'
import { uploadJSONToServer } from 'src/utils/ipfsService'
import { adjustLicense, uploadLicense } from 'src/api'
import { useWeb3 } from 'src/context/web3Context'
import { nitrilityFactoryAbi } from 'src/abi/nitrilityFactory'
import { MagicUserContext } from 'src/context/magicUserContext'
import { useCallback, useContext, useEffect, useState } from 'react'
import {
  TemplateDataIF,
  LicenseDataIF,
  SigningDataIF,
  ListingStatusType,
  CommonLicenseDataIF,
} from 'src/interface'
import useUtils from './useUtils'

export default function useListingLicense() {
  const { web3 } = useWeb3()
  const { magicUser } = useContext(MagicUserContext)
  const [balance, setBalance] = useState<number>(0)

  const { generateMetaData } = useUtils()

  // These constants must match the ones used in the smart contract.
  const SIGNING_DOMAIN = 'nitrility-license-marketplace'
  const SIGNING_DOMAIN_VERSION = '1'

  /**
   * @private
   * @returns {object} the EIP-721 signing domain, tied to the chainId of the signer
   */
  const signingDomain = async (sellerId: string) => {
    try {
      const contract = new web3.eth.Contract(nitrilityFactoryAbi, FACTORY_ADDR)
      const chainId = await contract.methods.getChainID().call()
      // Use the .call() method to read the value from the contract
      const collection = await contract.methods
        .fetchCollectionAddressOfArtist(sellerId)
        .call()

      const newDomain = {
        name: SIGNING_DOMAIN,
        version: SIGNING_DOMAIN_VERSION,
        verifyingContract: collection,
        chainId: parseInt(chainId),
      }

      return newDomain
    } catch (error) {
      // Handle errors, e.g., log or throw an exception
      console.log('Error in signingDomain:', error)
      throw error
    }
  }

  const signLicenseData = async (
    templateData: TemplateDataIF,
    sellerId: string,
  ) => {
    const newSigningData = {
      ...templateData,
      fPrice: web3.utils
        .toWei(templateData.fPrice.toString(), 'ether')
        .toString(),
      sPrice: web3.utils
        .toWei(templateData.sPrice.toString(), 'ether')
        .toString(),
      tPrice: web3.utils
        .toWei(templateData.tPrice.toString(), 'ether')
        .toString(),
      discountCode: {
        ...templateData.discountCode,
        percentage: web3.utils
          .toWei(templateData.discountCode.percentage.toString(), 'ether')
          .toString(),
        fixedAmount: web3.utils
          .toWei(templateData.discountCode.fixedAmount.toString(), 'ether')
          .toString(),
      },
    }

    const domain = await signingDomain(sellerId)
    const types = {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      DiscountCode: [
        { name: 'name', type: 'string' },
        { name: 'code', type: 'string' },
        { name: 'discountType', type: 'uint256' },
        { name: 'percentage', type: 'uint256' },
        { name: 'fixedAmount', type: 'uint256' },
        { name: 'infinite', type: 'bool' },
        { name: 'endTime', type: 'uint256' },
        { name: 'actived', type: 'bool' },
      ],
      TemplateType: [
        { name: 'fPrice', type: 'uint256' },
        { name: 'sPrice', type: 'uint256' },
        { name: 'tPrice', type: 'uint256' },
        { name: 'listingFormatValue', type: 'uint256' },
        { name: 'infiniteSupply', type: 'bool' },
        { name: 'infiniteListingDuration', type: 'bool' },
        { name: 'infiniteExclusiveDuration', type: 'bool' },
        { name: 'accessLevel', type: 'uint256' },
        { name: 'listingStartTime', type: 'uint256' },
        { name: 'listingEndTime', type: 'uint256' },
        { name: 'exclusiveEndTime', type: 'uint256' },
        { name: 'discountCode', type: 'DiscountCode' },
        { name: 'listed', type: 'uint256' },
      ],
    }
    const signTypedDataV4Payload = {
      domain,
      primaryType: 'TemplateType',
      types,
      message: newSigningData,
    }

    const params = [
      magicUser.accountAddress,
      JSON.stringify(signTypedDataV4Payload),
    ]
    const method = 'eth_signTypedData_v4'
    const signature = await web3.currentProvider.request({
      method,
      params,
    })

    return signature
  }

  const listLicense = async (licenseData: LicenseDataIF) => {
    try {
      const commonLicenseData: CommonLicenseDataIF = {
        albumName: licenseData.albumName,
        albumId: licenseData.albumId,
        sellerName: licenseData.sellerName,
        sellerId: licenseData.sellerId,
        avatarPath: licenseData.avatarPath,
        licenseName: licenseData.licenseName,
        imagePath: licenseData.imagePath,
        previewUrl: licenseData.previewUrl,
        trackId: licenseData.trackId,
        genres: licenseData.genres,
        artists: licenseData.artists,
        sellerAddress: licenseData.sellerAddress,
      }
      const metaData = generateMetaData(commonLicenseData)
      const metadataRes = await uploadJSONToServer(metaData)
      const tokenURI = `get/${metadataRes._id}`

      let newLicenseData = { ...licenseData, tokenURI }
      if (licenseData.artists.length === 1) {
        let creatorTemplateData = licenseData.signingData.creator
        if (creatorTemplateData.listed === ListingStatusType.Listed) {
          const signature = await signLicenseData(
            creatorTemplateData,
            licenseData.sellerId,
          )
          creatorTemplateData = { ...creatorTemplateData, signature }
          newLicenseData = {
            ...newLicenseData,
            tokenURI,
            signingData: {
              ...newLicenseData.signingData,
              creator: creatorTemplateData,
            },
          }
        }
      }

      const { success, msg, data } = await uploadLicense(newLicenseData)
      return {
        success,
        msg,
        data,
      }
    } catch (e) {
      return {
        success: false,
        msg: e.message,
        data: null,
      }
    }
  }

  const updateListing = async (
    listedId: number,
    sellerId: string,
    signingData: SigningDataIF,
  ) => {
    const tLoading = toast.loading('Updating Listing For Creator...')
    try {
      let newSigningData = signingData
      if (signingData.creator.listed === ListingStatusType.Listed) {
        const signature = await signLicenseData(signingData.creator, sellerId)
        newSigningData = {
          ...newSigningData,
          creator: {
            ...newSigningData.creator,
            signature,
          },
        }
      } else {
        newSigningData = signingData
      }

      const { success, msg } = await adjustLicense(listedId, signingData)
      if (success) {
        toast.success(msg, { id: tLoading })
        return true
      } else {
        toast.error(msg, { id: tLoading })
        return false
      }
    } catch (e) {
      toast.error(e.message, { id: tLoading })
      console.log('error in updating creator sync license', e)
      return false
    }
  }

  const getWithdrawalFund = useCallback(
    async (sellerId: string) => {
      try {
        const contract = new web3.eth.Contract(
          nitrilityFactoryAbi,
          FACTORY_ADDR,
        )
        const amount = await contract.methods
          .fetchBalanceOfArtist(sellerId)
          .call()
        return web3.utils.fromWei(amount)
      } catch (e) {
        console.log('error in getting withdrawal funds', e)
        return 0
      }
    },
    [web3],
  )

  const transferNFT = async (license, accountAddress) => {
    let toastTransferNFT
    try {
      const contract = new web3.eth.Contract(nitrilityFactoryAbi, FACTORY_ADDR)

      toastTransferNFT = toast.loading('Transfering The License...')
      const transaction = await contract.methods
        .transferNFT(license.sellerId, accountAddress, license.tokenId)
        .send({ from: magicUser.accountAddress })
      const receipt = await web3.eth.getTransactionReceipt(
        transaction.transactionHash,
      )
      if (receipt.status) {
        toast.success('transferred the license successfully', {
          id: toastTransferNFT,
        })
        return true
      } else {
        toast.error('could not transfer the license', {
          id: toastTransferNFT,
        })
        return false
      }
    } catch (e) {
      console.log('error on transfering the nft', e)
      toast.error('could not transfer the license', {
        id: toastTransferNFT,
      })
      return false
    }
  }

  const withdraw = async (sellerId) => {
    const toastLoading = toast.loading('Withdrawing funds...')
    try {
      const contract = new web3.eth.Contract(nitrilityFactoryAbi, FACTORY_ADDR)
      await contract.methods
        .withdrawFund(sellerId)
        .send({ from: magicUser.accountAddress })
      toast.success('Withdrawed Successfully', { id: toastLoading })
      return true
    } catch (e) {
      let errMsg
      console.log('error in withdrawing', e)
      if (e.message.includes(EthereumMsg.onlyOwner)) {
        errMsg = 'Please switch to your seller account'
      } else {
        if (e.message.includes(EthereumMsg.balance)) {
          errMsg = EthereumMsg.balance
        } else {
          if (e.message.includes(EthereumMsg.rejected)) {
            errMsg = EthereumMsg.rejected
          } else {
            errMsg = 'Something went wrong'
          }
        }
      }
      toast.error(errMsg, {
        id: toastLoading,
      })
      return false
    }
  }

  const getCollectionAddress = useCallback(
    async (sellerId) => {
      try {
        const contract = new web3.eth.Contract(
          nitrilityFactoryAbi,
          FACTORY_ADDR,
        )
        const collectionAddress = await contract.methods
          .fetchCollectionAddressOfArtist(sellerId)
          .call()
        return collectionAddress
      } catch (e) {
        console.log('error in the getCollectionAddress', e)
        return null
      }
    },
    [web3],
  )

  const getBalanceOfWallet = useCallback(async () => {
    try {
      if (!magicUser?.accountAddress || !web3) {
        setBalance(0)
      } else {
        const amount = await web3.eth.getBalance(magicUser.accountAddress)
        const balanceInEth = web3.utils.fromWei(amount, 'ether')
        setBalance(balanceInEth)
      }
    } catch (e) {
      setBalance(0)
    }
  }, [web3, magicUser?.accountAddress])

  useEffect(() => {
    getBalanceOfWallet()
  }, [getBalanceOfWallet])

  return {
    signLicenseData,
    updateListing,
    getWithdrawalFund,
    transferNFT,
    withdraw,
    getCollectionAddress,
    listLicense,
    balance,
  }
}
