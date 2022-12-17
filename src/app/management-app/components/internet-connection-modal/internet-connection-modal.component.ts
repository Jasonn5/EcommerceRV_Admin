import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-internet-connection-modal',
  templateUrl: './internet-connection-modal.component.html',
  styleUrls: ['./internet-connection-modal.component.scss']
})
export class InternetConnectionModalComponent implements OnInit {
  @Input() public message;
  @Input() public title;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
