import { Component, OnInit } from '@angular/core';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private internetConnectionService: InternetConnectionService) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
  }

}
