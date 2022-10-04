export interface IntraData {
  first_name: string;
  email: string;
  usual_full_name: string;
  image_url: string;
  login: string;
}

export interface ErrResponse {
  statusCode: number;
  message: string;
  error: string;
}