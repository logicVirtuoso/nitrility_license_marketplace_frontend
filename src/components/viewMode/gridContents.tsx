import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import LicenseCard from '../licenseCard'
import { CommonLicenseDataIF } from 'interface'

const useStyles = makeStyles({
  item: {
    width: '20%',
    flexBasis: '20%',
    flexGrow: 0,
  },
})

interface Props {
  isPending?: boolean
  licenses: Array<any>
  handleClickLicnese: (license: any) => void
}

export default function GridContents({
  isPending = false,
  licenses,
  handleClickLicnese,
}: Props) {
  const classes = useStyles()
  return (
    <>
      {licenses.length > 0 && (
        <Grid container spacing={2}>
          {licenses.map((license: any, index: number) => {
            const commonLicenseData: CommonLicenseDataIF = license
            return (
              <Grid item className={classes.item} key={index}>
                <LicenseCard
                  isPending={isPending}
                  commonLicenseData={commonLicenseData}
                  showControler={true}
                  handler={() => handleClickLicnese(license)}
                />
              </Grid>
            )
          })}
        </Grid>
      )}
    </>
  )
}
