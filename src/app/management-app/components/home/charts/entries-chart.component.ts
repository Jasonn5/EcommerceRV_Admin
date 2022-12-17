import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { CashRegisterEntryService } from "src/app/management-app/cash-registers/services/cash-register-entry.service";
import { MonthToLiteralPipe } from "src/app/management-app/pipes/month-to-literal.pipe";
import { CashRegisterEntry } from "src/app/models/cash-register-entry";
import { EntryTypeEnum } from "src/app/models/enums/entry-type-enum";

@Component({
    selector: 'app-entries-chart',
    template: `<chart type="horizontalBar" [data]="data"></chart>`
})
export class EntriesChartComponent implements OnInit {
    public data: any;
    private themeSubscription: any;
    public lastSixmonths;
    public MAX_MONTHS = 6;
    public currentDate: Date = new Date();
    public startDate;
    public endDate;
    public entries: CashRegisterEntry[] = [];
    public totalIncomeEntries;
    public totalExpenseEntries;

    constructor(
        private theme: NbThemeService,
        private monthToLiteral: MonthToLiteralPipe,
        private datepipe: DatePipe,
        private cashRegisterEntryService: CashRegisterEntryService
    ) { }

    ngOnInit() {
        this.lastSixmonths = [];
        this.totalIncomeEntries = [];
        this.totalExpenseEntries = [];
        this.entries = [];
        this.getLastSixMonths();
        this.getEntries();
    }

    getLastSixMonths() {
        var startDecember = 12;
        for (var i = 0; i < this.MAX_MONTHS; i++) {
            if (this.currentDate.getMonth() - i > 0) {
                this.lastSixmonths.push(this.monthToLiteral.transform(this.currentDate.getMonth() - i));
            } else {
                this.lastSixmonths.push(this.monthToLiteral.transform(startDecember));
                startDecember--;
            }
        }
        this.lastSixmonths = this.lastSixmonths.reverse();
    }

    getEntries() {
        this.endDate = this.datepipe.transform(this.currentDate, 'yyyy-MM-dd');
        this.getDateSixMonthsAgo();
        this.cashRegisterEntryService.listCashRegisterEntries(this.startDate, this.endDate).subscribe(entries => {
            if (entries.length != 0) {
                this.entries = entries;
                this.lastSixmonths.forEach(month => {
                    var incomeEntries = 0;
                    var expenseEntries = 0;
                    this.entries.forEach(entry => {
                        var entryMonth = this.monthToLiteral.transform(new Date(entry.date).getMonth() + 1);
                        if (month == entryMonth && entry.entryType == EntryTypeEnum.DEBIT) {
                            incomeEntries += entry.amount;
                        }
                        if (month == entryMonth && entry.entryType == EntryTypeEnum.CREDIT) {
                            expenseEntries += entry.amount;
                        }
                    });
                    this.totalIncomeEntries.push(incomeEntries);
                    this.totalExpenseEntries.push(expenseEntries);
                });
            }
            this.generateHorizontalBarChart();
        });
    }

    generateHorizontalBarChart() {
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

            const colors: any = config.variables;

            this.data = {
                labels: this.lastSixmonths,
                datasets: [{
                    label: 'Ingresos',
                    backgroundColor: colors.primary,
                    borderWidth: 1,
                    data: this.totalIncomeEntries,
                }, {
                    label: 'Egresos',
                    backgroundColor: colors.danger,
                    data: this.totalExpenseEntries,
                }]
            };
        });
    }

    getDateSixMonthsAgo() {
        var startDecember = 12;
        var actualYear = this.currentDate.getFullYear();
        var sixMonthsAgo = (this.currentDate.getMonth() + 1) - 6;

        if (sixMonthsAgo > 0) {
            this.startDate = this.datepipe.transform(actualYear + '-' + sixMonthsAgo + '-01', 'yyyy-MM-dd');
        } else {
            actualYear--;
            sixMonthsAgo = startDecember + sixMonthsAgo;
            this.startDate = this.datepipe.transform(actualYear + '-' + sixMonthsAgo + '-01', 'yyyy-MM-dd');
        }
    }
}