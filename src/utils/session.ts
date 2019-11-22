interface Ires {
  [key:string]: string;
}

export const updateSession = (res:Ires) => {
  localStorage.setItem('user', res.uid);
  localStorage.setItem('access_token', res.access_token);
  localStorage.setItem('refresh_token', res.refresh_token);
};

export const clearSession = () => {
  [
    'access_token',
    'refresh_token',
    'user',
    'role',
    'uid',
    'tel',
    'relationRef',
    'institutionId',
    'reduxState',
    'openedSub',
    'activeNavInstitutionId',
    'institutionName',
    'accid2session',
    'activeNavPath',
    'QCDoctorId',
    'onlyConsultations',
  ]
    .forEach((item) => {
      localStorage.removeItem(item);
    });
};
