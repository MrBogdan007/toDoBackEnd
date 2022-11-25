export interface Todo {
   id: number,
   name: string,
   description: string,
   userId: number,
   timeStamp: string,
   timeStampUpdate: string,
   status: 'NotStarted'|'OnGoing'|'Completed';
}