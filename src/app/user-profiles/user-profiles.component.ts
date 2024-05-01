import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserProfilesService } from './user-profiles.service';

@Component({
  selector: 'app-user-profiles',
  templateUrl: './user-profiles.component.html',
  styleUrls: ['./user-profiles.component.css'],
})
export class UserProfilesComponent implements OnInit {
  userList: any = [];
  addUserMode: string = 'Add Mode';
  createUserForm: any = FormGroup;
  selectedUserUniqueId: string = '';
  selectedFile: any = null;
  allowedTypes = ['image/png', 'image/jpeg']; // Allowed image types

  @ViewChild('modalCloseBtn') modalCloseBtn!: ElementRef;
  @ViewChild("fileInput") fileInput!: ElementRef 


  constructor(
    private userProfileService: UserProfilesService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.intializeuserForm();
    this.getAllUsers();
  }

  intializeuserForm() {
    this.createUserForm = this.formBuilder.group({
      fullName: new FormControl('',[Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z]+[a-zA-Z ]*$')]),
      mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]+$')] ),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
      address: new FormControl(''),
      class: new FormControl(''),
      file: new FormControl('')
    });
  }

  toggleToEditModalBox(userDetails: any) {
    this.addUserMode = 'Edit Mode';
    this.createUserForm.get('fullName').setValue(userDetails?.fullName);
    this.createUserForm.get('mobileNumber').setValue(userDetails?.mobileNumber);
    this.createUserForm.get('email').setValue(userDetails?.email);
    this.createUserForm.get('class').setValue(userDetails?.class);
    this.createUserForm.get('address').setValue(userDetails?.address);
    this.selectedUserUniqueId = userDetails?.uniqueId;
  }

  onFileSelected(event: any) {
    //this.selectedFile = null;
    const file: File = event.target.files[0];
    if (file && this.allowedTypes.includes(file.type)) {
      this.selectedFile = file;
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      this.userProfileService.fileUpload(formData).subscribe((res: any) => {
        if(res.status){
          this.createUserForm.get('file').setValue(res?.fileName);
        }
      })
    } else {
      // Reset the selected file and show an error message
      this.selectedFile = null;
      this.fileInput.nativeElement.value = '';
      console.error('Please select a valid image file (PNG, JPEG)');
    }
  }

  getAllUsers() {
    this.userProfileService.getAllUsers().subscribe(
      (res: any) => {
        if (res.status) {
          this.userList = res.data;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteUser(id: string, index: number) {
    this.userProfileService.deleteuserById(id).subscribe(
      (res: any) => {
        if (res.status) {
          this.userList.splice(index, 1); // Remove the user from the userList array
        }
      },
      (error) => {
        console.log(error);
        alert(JSON.stringify(error));
      }
    );
  }

  getUploadedFile(id: string){
    this.userProfileService.getUploadedFile(id).subscribe((res: any) => {
      if(res.status){
        // Convert Buffer to Uint8Array
        const uint8Array = new Uint8Array(res.data.data);
        // Convert Uint8Array to ArrayBuffer
        const arrayBuffer = uint8Array.buffer;
        // Create Blob from ArrayBuffer
        const blob = new Blob([arrayBuffer]);
        // Create object URL
        const url = window.URL.createObjectURL(blob);
        // Create a link element
        const link = document.createElement('a');
        // Set its href attribute to the temporary URL
        link.href = url;
        // Set the download attribute to specify the file name
        link.download = res?.fileName;
        // Append the link to the document body
        document.body.appendChild(link);
        // Programmatically click the link to trigger the download
        link.click();
        // Clean up by removing the link and revoking the temporary URL
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    },(error) => {
      console.log(error);
      alert(JSON.stringify(error));
    })
  }


  onSubmitUserData(){
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }
    console.log(this.createUserForm.value, 'in 102.......')
    if(this.addUserMode == 'Add Mode'){
      this.userProfileService.saveUser(this.createUserForm.value).subscribe((res: any) => {
        if(res.status){
          alert(res.message);
          this.getAllUsers();
          this.modalCloseBtn.nativeElement.click();
          this.selectedFile = null;
          this.fileInput.nativeElement.value = '';
        }
      }, (error) => {
        console.log(error);
        alert(JSON.stringify(error));
      })
    }
    else{
      this.userProfileService.updateUser(this.createUserForm.value,this.selectedUserUniqueId).subscribe((res:any) => {
        if(res.status){
          alert(res.message);
          this.getAllUsers();
          this.modalCloseBtn.nativeElement.click();
          this.selectedUserUniqueId = '';
          this.selectedFile = null;
          this.fileInput.nativeElement.value = '';
        }
      }, (error) => {
        console.log(error);
        alert(JSON.stringify(error));
      })
    }
  }
 
}
