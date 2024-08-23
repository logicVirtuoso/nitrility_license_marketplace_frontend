import { Box } from '@mui/material'
import OfferDetailsDlg, {
  OfferDetailsHandlerTypes,
} from './detailsDlg/offerDetailsDlg'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import CounterOfferDialog from './counterOfferDlg'
import OfferMadeResultDlg from './offerMadeResultDlg'
import {
  CommonLicenseDataIF,
  ProjectTypeLabels,
  TemplateDataIF,
  UsageDetailIF,
} from 'src/interface'
import UsageDialog from './usageDialog'
import { IPFS_METADATA_API_URL } from 'src/config'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { useSelector } from 'react-redux'

interface Props {
  offerData: any
  commonLicenseData: CommonLicenseDataIF
  ref: React.Ref<HTMLDivElement>
}

interface CustomRef {
  toggleState: () => void
}

const OfferManager = React.forwardRef<CustomRef, Props>(
  ({ offerData, commonLicenseData }, ref) => {
    const navigate = useNavigate()
    const [openOfferDetailsDlg, setOpenOfferDetailsDlg] =
      useState<boolean>(false)
    const [openCounterOfferDetailsDlg, setOpenCounterOfferDetailsDlg] =
      useState<boolean>(false)
    const [openOfferMadeResultDlg, setOpenOfferMadeResultDlg] =
      useState<boolean>(false)
    const [openUsageDlg, setOpenUsageDlg] = useState<boolean>(false)

    const [syncData, setSyncData] = useState<TemplateDataIF>()
    const [initialFormValues, setInitialFormValues] = useState<UsageDetailIF>({
      projectType: ProjectTypeLabels.Personal,
      contentTitle: '',
      intendedPlatforms: '',
      releaseDate: Date.now(),
      productionDescription: '',
      aiModelDescription: '',
      contentDescription: '',
      previewFiles: [],
      licenseUsage: '',
      submit: null,
    })
    const [usageDetails, setUsageDetails] = useState<UsageDetailIF>()
    const authorization = useSelector(
      (state: { authorization: AuthType }) => state.authorization,
    )
    const [offerDetailsHandlerType, setOfferDetailsHandlerType] =
      useState<OfferDetailsHandlerTypes>(OfferDetailsHandlerTypes.None)

    useEffect(() => {
      const init = async () => {
        if (offerData) {
          try {
            setSyncData(offerData.purchasedSigningData)

            const metaRes = await axios.get(
              `${IPFS_METADATA_API_URL}/${offerData.purchasedTokenURI}`,
            )
            const initialUsageData = {
              projectType: metaRes.data.metadata.properties.projectType,
              releaseDate: metaRes.data.metadata.properties.releaseDate,
              contentTitle: metaRes.data.metadata.properties.contentTitle,
              contentDescription:
                metaRes.data.metadata.properties.contentDescription,
              productionDescription:
                metaRes.data.metadata.properties.productionDescription,
              aiModelDescription:
                metaRes.data.metadata.properties.aiModelDescription,
              previewFiles: metaRes.data.metadata.properties.previewFiles,
              intendedPlatforms:
                metaRes.data.metadata.properties.intendedPlatforms,
              licenseUsage: metaRes.data.metadata.properties.licenseUsage,
            }
            setUsageDetails(initialUsageData)
            setInitialFormValues({
              ...initialUsageData,
              submit: null,
            })
          } catch (e) {
            console.log('error in getting license for listedId', e)
            navigate('/')
          }
        }
      }
      init()
    }, [offerData, navigate])

    const offerDetailshandler = (type: OfferDetailsHandlerTypes) => {
      setOpenOfferDetailsDlg(false)
      setOfferDetailsHandlerType(type)
      const bSeller = authorization.currentUser.sellerId == offerData.sellerId
      if (type === OfferDetailsHandlerTypes.CounterOffer) {
        setOpenCounterOfferDetailsDlg(true)
      } else {
        if (bSeller) {
          setOpenCounterOfferDetailsDlg(true)
        } else {
          setOpenUsageDlg(true)
        }
      }
    }

    const usageCallback = (data: UsageDetailIF) => {
      setUsageDetails(data)
      setOpenCounterOfferDetailsDlg(true)
    }

    const toggleState = () => {
      setOpenOfferDetailsDlg(true)
    }

    useImperativeHandle(ref, () => ({
      toggleState,
    }))

    return (
      <React.Fragment>
        {offerData && commonLicenseData && (
          <>
            <OfferDetailsDlg
              open={openOfferDetailsDlg}
              setOpen={setOpenOfferDetailsDlg}
              offer={offerData}
              commonLicenseData={commonLicenseData}
              handler={offerDetailshandler}
            />
            <CounterOfferDialog
              open={openCounterOfferDetailsDlg}
              setOpen={setOpenCounterOfferDetailsDlg}
              backForwards={() => {
                setOpenCounterOfferDetailsDlg(false)
                setOpenOfferDetailsDlg(true)
              }}
              offer={offerData}
              handler={(result: boolean) => setOpenOfferMadeResultDlg(true)}
            />
            {commonLicenseData && (
              <>
                <UsageDialog
                  open={openUsageDlg}
                  setOpen={setOpenUsageDlg}
                  initialFormValues={initialFormValues}
                  commonLicenseData={commonLicenseData}
                  syncData={syncData}
                  licensingType={offerData.licensingType}
                  accessLevel={offerData.accessLevel}
                  usageCallback={usageCallback}
                />
                <OfferMadeResultDlg
                  open={openOfferMadeResultDlg}
                  setOpen={setOpenOfferMadeResultDlg}
                  imagePath={commonLicenseData.imagePath}
                  licenseName={commonLicenseData.licenseName}
                  sellerName={commonLicenseData.sellerName}
                  albumName={commonLicenseData.albumName}
                />
              </>
            )}
          </>
        )}
      </React.Fragment>
    )
  },
)

export default OfferManager
