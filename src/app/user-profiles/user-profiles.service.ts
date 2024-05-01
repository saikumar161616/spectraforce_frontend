import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from 'src/app/core/services/api-url.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfilesService {
  constructor(private http: HttpClient) {}

  saveUser(body:object){
    return this.http.post(ApiUrls.users,body);
  }

  updateUser(body:object, id:string){
    return this.http.put(`${ApiUrls.users}${id}`, body)
  }

  getAllUsers(): Observable<any> {
    return this.http.get(ApiUrls.users);
  }

  deleteuserById(id: string): Observable<any> {
    return this.http.delete(`${ApiUrls.users}${id}`);
  }

  fileUpload(file: any): Observable<any> {
    return this.http.post(`${ApiUrls.upload}file-upload` , file)
  }

  getUploadedFile(id:any): Observable<any> {
    return this.http.get(`${ApiUrls.users}file/${id}`)
  }
}
