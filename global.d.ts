interface IRes {
  status: string;
  data: any;
  result?: string;
  message?: string;
}

interface commonData {
  [index: string]: string;
}

interface Iins {
  id: string;
  name: string;
}

interface Iorg {
  organizationId: string;
  organizationName: string;
  role: string;
  roles: string[]
  status: string;
  consultationAcceptStatus?: string;
  consultationExpireTimeStatus?: string;
  depCategory?: string;
  departmentId?: string;
  departmentName?: string;
  orgRedPoint?: boolean;
  qrCodeUrl?: string;
  unAcceptEndTime?: number;
}

interface Icert {
  imageIds: string[];
  type: string;
}
interface Iuser {
  username: string;
  roles: string[]
  status: string;
  tel: string;
  avatar?: string;
  bank?: string;
  bankCardNumber?: number;
  biography?: string;
  certificates?: Icert[];
  consultationAcceptStatus?: string;
  departmentCategory?: string;
  departmentName?: string;
  doctorAttribute?: string;
  doctorGroup?: null
  experience?: string;
  expertise?: string;
  firstProfessionCompany?: string;
  firstProfessionCompanyLevel?: string;
  goodsDescriptions?: null
  hospitalIntroduction?: string;
  idNumber?: string;
  inviteStatus?: string;
  inviterName?: string;
  inviterTel?: string;
  meetingLecture?: string;
  name?: string;
  organizationId?: string;
  qrCodeUrl?: string;
  sex?: string;
  showId?: number;
  title?: string;
  unAcceptEndTime?: number;
  workOrderAcceptStatus?: string;
}

interface Window {
  nim: any;
}
