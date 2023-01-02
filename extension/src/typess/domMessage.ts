import { AllPropertyDataResponse } from "../../../server/types/property";

export type DOMMessageResponse = {
  title: string;
  headlines: string[];
}

export type DOMMessage = {
  type: 'GET_DOM',
  response: AllPropertyDataResponse | null
}
export type OtherDOMMessage = {
  message: string,
  url: string
}