export interface ImagePath {
  imagePath: string
  imageFile: File
}
export interface ContactInfoProps {
  phoneNumber?: string
  showPhoneNumber?: boolean
  contactEmail?: string
  showContactEmail?: boolean
}

export interface PublicProfilePageProps {
  platformTitle: string
  sellerId: string
  avatarImage: ImagePath
  bannerImage: ImagePath
  userName: string
  contactInfo: ContactInfoProps
  followers?: Array<any>
  socialLinks?: Array<any>
  tabPages?: Array<any>
}

export interface TabItem {
  id: number
  tabName: string
  tabPage: any
}
