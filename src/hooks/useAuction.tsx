import { AUCTION_ADDR } from 'src/config'
import { uploadJSONToServer } from 'src/utils/ipfsService'
import { useWeb3 } from 'src/context/web3Context'
import { nitrilityAuctionAbi } from 'src/abi/nitrilityAuction'
import { MagicUserContext } from 'src/context/magicUserContext'
import { useCallback, useContext } from 'react'
import {
  LicensingTypes,
  UsageDetailIF,
  AccessLevel,
  TemplateDataIF,
  CommonLicenseDataIF,
  EventTypes,
} from 'src/interface'
import useUtils from './useUtils'
import { useTokenPrice } from './useTokenPrice'
import { roundAt18thDecimal } from 'src/utils/utils'

export default function useAuction() {
  const { tokenPrice } = useTokenPrice()
  const { web3 } = useWeb3()
  const { magicUser } = useContext(MagicUserContext)
  const { generateMetaData, usdToEther } = useUtils()

  const placeOffer = async (
    commonLicenseData: CommonLicenseDataIF,
    offerPrice: number,
    offerDuration: number,
    licensingType: LicensingTypes,
    accessLevel: AccessLevel,
    usageData?: UsageDetailIF,
  ) => {
    try {
      const metadata = generateMetaData(commonLicenseData, usageData)
      const metadataRes = await uploadJSONToServer(metadata)
      const url = `get/${metadataRes._id}`
      const contract = new web3.eth.Contract(nitrilityAuctionAbi, AUCTION_ADDR)

      const price = roundAt18thDecimal(offerPrice / tokenPrice)
      const estimatedGasLimit = await contract.methods
        .placeOffer(
          commonLicenseData.listedId,
          offerDuration,
          url,
          licensingType,
          accessLevel,
        )
        .estimateGas({ from: magicUser.accountAddress, value: price })
      const transaction = await contract.methods
        .placeOffer(
          commonLicenseData.listedId,
          offerDuration,
          url,
          licensingType,
          accessLevel,
        )
        .send({
          from: magicUser.accountAddress,
          value: price,
          gas: Math.ceil(estimatedGasLimit * 1.1),
        })
      const receipt = await web3.eth.getTransactionReceipt(
        transaction.transactionHash,
      )
      if (receipt.status) {
        return {
          success: true,
          msg: 'You made offer successfully.',
        }
      } else {
        return {
          success: false,
          msg: 'error in making offer',
        }
      }
    } catch (e) {
      return {
        success: false,
        msg: e.message,
      }
    }
  }

  const rejectOfferByBuyer = async (offerId) => {
    try {
      const contract = new web3.eth.Contract(nitrilityAuctionAbi, AUCTION_ADDR)
      const estimatedGasLimit = await contract.methods
        .rejectOffer(offerId)
        .estimateGas({ from: magicUser.accountAddress })
      const transaction = await contract.methods.rejectOffer(offerId).send({
        from: magicUser.accountAddress,
        gas: Math.ceil(estimatedGasLimit * 1.1),
      })
      const receipt = await web3.eth.getTransactionReceipt(
        transaction.transactionHash,
      )
      if (receipt.status) {
        return { success: true, msg: 'Rejected the offer successfully' }
      } else {
        return { success: false, msg: 'Something went wrong' }
      }
    } catch (e) {
      return { success: false, msg: e.message }
    }
  }

  const acceptOffer = async (
    offerId: number,
    accessLevel: AccessLevel,
    syncData: TemplateDataIF,
    sellerId: string,
  ) => {
    try {
      const contract = new web3.eth.Contract(nitrilityAuctionAbi, AUCTION_ADDR)
      const templateData = {
        fPrice: web3.utils
          .toWei(syncData.fPrice.toString(), 'ether')
          .toString(),
        sPrice: web3.utils
          .toWei(syncData.sPrice.toString(), 'ether')
          .toString(),
        tPrice: web3.utils
          .toWei(syncData.tPrice.toString(), 'ether')
          .toString(),
        listingFormatValue: syncData.listingFormatValue,
        totalSupply: syncData.totalSupply,
        infiniteSupply: syncData.infiniteSupply,
        infiniteListingDuration: syncData.infiniteListingDuration,
        infiniteExclusiveDuration: syncData.infiniteExclusiveDuration,
        accessLevel: syncData.accessLevel,
        listingStartTime: syncData.listingStartTime,
        listingEndTime: syncData.listingEndTime,
        exclusiveEndTime: syncData.exclusiveEndTime,
        discountCode: {
          ...syncData.discountCode,
          percentage: web3.utils
            .toWei(syncData.discountCode.percentage.toString(), 'ether')
            .toString(),
          fixedAmount: web3.utils
            .toWei(syncData.discountCode.fixedAmount.toString(), 'ether')
            .toString(),
        },
        listed: syncData.listed,
        signature: syncData.signature,
      }
      const revenues = syncData.revenues.map((item) => {
        return {
          ...item,
          percentage: web3.utils
            .toWei(item.percentage.toString(), 'ether')
            .toString(),
        }
      })

      // Fetch the old price from the contract
      let oldPrice = await contract.methods
        .fetchCurrentOfferPrice(offerId)
        .call()
      oldPrice = new web3.utils.BN(oldPrice)
      // Ensure that the raw values are correctly converted to BN
      let newPrice
      if (accessLevel == AccessLevel.NonExclusive) {
        newPrice = new web3.utils.BN(templateData.fPrice)
      } else {
        newPrice = new web3.utils.BN(templateData.sPrice)
      }

      let additionalValue
      if (newPrice.gt(oldPrice)) {
        additionalValue = newPrice.sub(oldPrice)
      } else {
        additionalValue = new web3.utils.BN(0)
      }

      const estimatedGasLimit = await contract.methods
        .acceptOffer(offerId, sellerId, templateData, revenues)
        .estimateGas({ from: magicUser.accountAddress, value: additionalValue })

      const tx = await contract.methods
        .acceptOffer(offerId, sellerId, templateData, revenues)
        .send({
          from: magicUser.accountAddress,
          value: additionalValue,
          gas: Math.ceil(estimatedGasLimit * 1.1),
        })

      const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash)
      console.log('receipt', receipt)
      if (receipt.status) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log('Error accepting offer:', e.message)
      return false
    }
  }

  const editOffer = async (
    offerId: number,
    newOfferPrice: number,
    offerDuration: number,
    tokenURI: string,
    eventType: EventTypes,
  ) => {
    try {
      const contract = new web3.eth.Contract(nitrilityAuctionAbi, AUCTION_ADDR)

      let oldPrice = await contract.methods
        .fetchCurrentOfferPrice(offerId)
        .call()
      oldPrice = new web3.utils.BN(oldPrice)
      const newPrice = new web3.utils.BN(
        web3.utils.toWei(newOfferPrice.toString(), 'ether').toString(),
      )
      let additionalValue
      if (newPrice.gt(oldPrice)) {
        additionalValue = newPrice.sub(oldPrice)
      } else {
        additionalValue = new web3.utils.BN(0)
      }

      const estimatedGasLimit = await contract.methods
        .editOffer(offerId, newPrice, offerDuration, tokenURI, eventType)
        .estimateGas({
          from: magicUser.accountAddress,
          value: additionalValue,
        })

      const transaction = await contract.methods
        .editOffer(offerId, newPrice, offerDuration, tokenURI, eventType)
        .send({
          from: magicUser.accountAddress,
          value: additionalValue,
          gas: Math.ceil(estimatedGasLimit * 1.1),
        })
      const receipt = await web3.eth.getTransactionReceipt(
        transaction.transactionHash,
      )
      if (receipt.status) {
        return {
          success: true,
          msg: 'changed your offer successfully.',
        }
      } else {
        return {
          success: false,
          msg: 'error in changing your offer',
        }
      }
    } catch (e) {
      console.log('error in changing offer', e)
      return {
        success: false,
        msg: e.message,
      }
    }
  }

  const purchaseLicenses = async (
    addedLicenses,
    usageDetails,
    offerDetails,
    commonLicenseDatas: Array<CommonLicenseDataIF>,
    syncDatas: Array<TemplateDataIF>,
    accessLevels: Array<AccessLevel>,
    licensingTypes: Array<LicensingTypes>,
  ) => {
    try {
      const newTokenURIs = await Promise.all(
        commonLicenseDatas.map(async (commonLicenseData, idx) => {
          const metadata = generateMetaData(
            commonLicenseData,
            usageDetails[idx],
          )
          const metadataRes = await uploadJSONToServer(metadata)
          return `get/${metadataRes._id}`
        }),
      )

      let totalPrice = 0
      const inputs = addedLicenses.map((addedLicense, idx) => {
        const { cartedInfo } = addedLicense
        const templateData = {
          fPrice: web3.utils
            .toWei(syncDatas[idx].fPrice.toString(), 'ether')
            .toString(),
          sPrice: web3.utils
            .toWei(syncDatas[idx].sPrice.toString(), 'ether')
            .toString(),
          tPrice: web3.utils
            .toWei(syncDatas[idx].tPrice.toString(), 'ether')
            .toString(),
          listingFormatValue: syncDatas[idx].listingFormatValue,
          totalSupply: syncDatas[idx].totalSupply,
          infiniteSupply: syncDatas[idx].infiniteSupply,
          infiniteListingDuration: syncDatas[idx].infiniteListingDuration,
          infiniteExclusiveDuration: syncDatas[idx].infiniteExclusiveDuration,
          accessLevel: syncDatas[idx].accessLevel,
          listingStartTime: syncDatas[idx].listingStartTime,
          listingEndTime: syncDatas[idx].listingEndTime,
          exclusiveEndTime: syncDatas[idx].exclusiveEndTime,
          discountCode: {
            ...syncDatas[idx].discountCode,
            percentage: web3.utils
              .toWei(syncDatas[idx].discountCode.percentage.toString(), 'ether')
              .toString(),
            fixedAmount: web3.utils
              .toWei(
                syncDatas[idx].discountCode.fixedAmount.toString(),
                'ether',
              )
              .toString(),
          },
          listed: syncDatas[idx].listed,
          signature: syncDatas[idx].signature ?? '0x',
        }
        let offerPrice = parseFloat(offerDetails[idx].offerPrice)
        totalPrice += offerPrice * cartedInfo.counts

        offerPrice = usdToEther(offerPrice)
        offerPrice = web3.utils.toWei(offerPrice.toString(), 'ether').toString()
        return {
          discountCode: '',
          newTokenURI: newTokenURIs[idx],
          sellerId: commonLicenseDatas[idx].sellerId,
          listedId: commonLicenseDatas[idx].listedId,
          offerPrice,
          offerDuration: offerDetails[idx].offerDuration,
          counts: cartedInfo.counts,
          accessLevel: accessLevels[idx],
          licensingType: licensingTypes[idx],
          templateData,
        }
      })
      totalPrice = usdToEther(totalPrice)
      totalPrice = web3.utils.toWei(totalPrice.toString(), 'ether').toString()
      const contract = new web3.eth.Contract(nitrilityAuctionAbi, AUCTION_ADDR)
      const estimatedGasLimit = await contract.methods
        .purchaseLicenses(inputs)
        .estimateGas({ from: magicUser.accountAddress, value: totalPrice })
      const transaction = await contract.methods.purchaseLicenses(inputs).send({
        from: magicUser.accountAddress,
        value: totalPrice,
        gas: Math.ceil(estimatedGasLimit * 1.1),
      })
      const receipt = await web3.eth.getTransactionReceipt(
        transaction.transactionHash,
      )
      if (receipt.status) {
        return {
          success: true,
          msg: 'Successfully Purchased the licenses',
        }
      } else {
        return {
          success: false,
          msg: 'Something went wrong',
        }
      }
    } catch (e) {
      console.log('error in purchasing the multi licenses', e.message)
      return {
        success: false,
        msg: e.message,
      }
    }
  }

  return {
    placeOffer,
    editOffer,
    acceptOffer,
    rejectOfferByBuyer,
    purchaseLicenses,
  }
}
