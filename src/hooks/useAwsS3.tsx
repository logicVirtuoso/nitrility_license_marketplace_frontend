import AWS from 'aws-sdk'
import { S3_BUCKET } from 'src/config'

const bucketName = 'nitrility-bucket'
const region = 'us-east-1'

AWS.config.update({
  region: region,
  accessKeyId: 'AKIAYR5CPEB73VQ7MBQQ',
  secretAccessKey: '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',
})

const s3Bucket = new AWS.S3({
  params: { Bucket: bucketName },
  region: region,
})

export default function useAwsS3() {
  const checkAvatarExists = async (accountAddress: string) => {
    const params = {
      Bucket: bucketName,
      Key: 'avatars/' + accountAddress,
    }

    try {
      await s3Bucket.headObject(params).promise()
      return true
    } catch (error) {
      return false
    }
  }

  const uploadAvatar = async (file: File, accountAddress: string) => {
    const params = {
      Body: file,
      Bucket: bucketName,
      Key: 'avatars/' + accountAddress,
    }

    try {
      await s3Bucket.putObject(params).promise()
      return `${S3_BUCKET}/avatars/${accountAddress}`
    } catch (error) {
      return null
    }
  }

  const uploadCollection = async (file: File, accountAddress: string) => {
    const params = {
      Body: file,
      Bucket: bucketName,
      Key: 'collections/' + accountAddress + `/${file.name}`,
    }

    try {
      await s3Bucket.putObject(params).promise()
      return `${S3_BUCKET}/collections/${accountAddress}/${file.name}`
    } catch (error) {
      return null
    }
  }

  const uploadPreviewFiles = async (file: File, accountAddress: string) => {
    const params = {
      Body: file,
      Bucket: bucketName,
      Key: 'previews/' + accountAddress + `/${file.name}`,
    }

    try {
      await s3Bucket.putObject(params).promise()
      return `${S3_BUCKET}/previews/${accountAddress}/${file.name}`
    } catch (error) {
      return null
    }
  }

  const deleteAvatar = async (accountAddress: string) => {
    const params = {
      Bucket: bucketName,
      Key: 'avatars/' + accountAddress,
    }

    try {
      const data = await s3Bucket.deleteObject(params).promise()
      return true
    } catch (error) {
      return false
    }
  }

  const deletePreviewfile = async (
    accountAddress: string,
    fileName: string,
  ) => {
    const params = {
      Bucket: bucketName,
      Key: 'previews/' + accountAddress + `/${fileName}`,
    }

    try {
      const data = await s3Bucket.deleteObject(params).promise()
      return true
    } catch (error) {
      return false
    }
  }

  const downloadPreviewfiles = async (filePaths: string[]) => {
    try {
      await Promise.all(
        filePaths.map(async (filePath) => {
          const params = {
            Bucket: bucketName,
            Key: filePath.substring(filePath.indexOf('previews/')),
          }
          try {
            const data = await s3Bucket.getObject(params).promise()
            const url = window.URL.createObjectURL(
              new Blob([data.Body as Blob]),
            )
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filePath.split('/').pop())
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
            window.URL.revokeObjectURL(url)
            return true
          } catch (error) {
            return false
          }
        }),
      )
      return true
    } catch (e) {
      console.log('error in download preview files', e)
      return false
    }
  }

  return {
    uploadCollection,
    uploadPreviewFiles,
    uploadAvatar,
    checkAvatarExists,
    deleteAvatar,
    deletePreviewfile,
    downloadPreviewfiles,
  }
}
