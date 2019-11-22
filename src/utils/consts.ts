export const localRole = localStorage.getItem('role') || '';

export const uid = localStorage.getItem('user');

export const initialOrg: Iorg = {
  organizationId: '',
  organizationName: '',
  role: '',
  roles: [],
  status: '',
  qrCodeUrl: '',
};
