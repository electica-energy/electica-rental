interface Address {
  address1: string;
  address2: string;
  city: string;
  pincode: string;
  landmark: string;
}

interface DocumentTypes {
  aadhar: { front: string; back: string };
  pan: { front: string };
  dl: { front: string; back: string };
}

export interface SampleForm {
  name: string;
  phone: string;
  email: string;
  role: string;
  address: Address;
  auth_by: string;
  profile_pic_url: string;
  deposit: number;
  verified: boolean;
  verified_through: string;
  vehicle_name: string;
  vehicle_number: string;
  uploaded_documents: DocumentTypes;
}
