
// 医院
export const DEPARTMENT_DOCTOR_SIZE = 10;
export const DEPARTMENT_PATIENT_SIZE = 10;
export const DEPARTMENT_OPERATOR_SIZE = 10;
export const DEPARTMENT_RELATION_SIZE = 10;
export const SUB_ADMIN_SIZE = 10;
export const HOSPITAL_SIZE = 10;
export const ADVISER_SIZE = 10;

// 医生

export const DOCTOR_PATIENT_SIZE = 10;
export const DOCTOR_CONSULATION_SIZE = 10;
export const DOCTOR_ASSSISTANT_SIZE = 10;
export const DOCTOR_ASSISTANT_PATIENT_SIZE = 10;
export const CONSULTATION_DOCTOR_SIZE = 15;
export const UNCONFIRM_LIST_SIZE = 25;
export const CONFIRMED_LIST_SIZE = 25;
export const CONSULTATION_LIST_SIZE = 25;
export const HISTORY_CHAT_MESSAGE_SIZE = 25;
export const FACTION_SIZE = 20;
export const FACTION_LIST_SIZE = 10;
export const DOCTOR_RESERVATION_PATIENTS_SIZE = 10;
export const APPOINTMENT_LIST_SIZE = 10;
export const DOCTOR_REGISTER_URL = 'https://hybrid.test.xzlcorp.com/register/doctor';
// export const DOCTOR_REGISTER_URL = 'http://172.16.10.209:8084/register/doctor';

// 运营
export const OPERATE_UNCHECKED_IMAGES_SIZE = 10;
export const OPERATE_NOTIFICATION_SIZE = 10;
export const OPERATE_PATIENT_SIZE = 10;
export const OPERATE_CHECKED_IMAGES_SIZE = 10;
export const FETCH_OPERATOR_NOTIFICATION_TIME = 60 * 1000; // 秒

export const defaultAvatar = 'https://staff-avatars-prod.oss-cn-beijing.aliyuncs.com/default-avatar.jpg';

// 常量
export const FETCH_CHAT_UNREAD_TIME = 2 * 1000;

export const privateConf = {
  // lbs地址
  lbs_web: 'http://127.0.0.1/lbs/webconf.jsp',
  // 是否使用wss
  link_ssl_web: false,
  // 上传地址
  nos_uploader_web: '',
  // 是否使用https
  https_enabled: false,
  // 下载地址
  nos_downloader: '127.0.0.1/{bucket}/{object}',
  // 下载加速地址
  nos_accelerate: '',
  nos_accelerate_host: '',
  // 数据上报地址
  nt_server: '',
};

export const IM = {
  // 本地消息显示数量，会影响性能
  localMsglimit: 99,
  useDb: false,
  // appkey: '1e82c88ea2c1d07f67ecfdabf23940e9',
  // appkey: 'f6ad4d84cfa532ebd8b9505c5e363b12',
  appkey: '1e82c88ea2c1d07f67ecfdabf23940e9',
  url: 'https://apptest.netease.im',
};
