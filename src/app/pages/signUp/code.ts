import { Component } from "@angular/core";
import { VerificationCode } from "../../verification-code/verification-code";
@Component({
    selector: 'code-page',
    imports:[VerificationCode],
    template: `<app-verification-code [boxNumber]="5" [maxLength]="1"></app-verification-code>`,
})
export class CodePage {
    
}

