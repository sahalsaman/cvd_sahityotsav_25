import moment from "moment";

export default function date_pipe(date: any, format: string): any {
    return moment(date).format(format)
  }