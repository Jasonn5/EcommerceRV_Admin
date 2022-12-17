import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbColorHelper, NbThemeService } from "@nebular/theme";
import { MonthToLiteralPipe } from "src/app/management-app/pipes/month-to-literal.pipe";
import { SaleService } from "src/app/management-app/sales/services/sale.service";
import { Sale } from "src/app/models/sale";

@Component({
    selector: 'app-sales-chart',
    template: `<chart type="line" [data]="data"></chart>`
})
export class SalesChartComponent implements OnInit {
    public data: any;
    private themeSubscription: any;
    public lastSixmonths;
    public MAX_MONTHS = 6;
    public currentDate: Date = new Date();;
    public endDate;
    public startDate;
    public sales: Sale[] = [];
    public salesInTheLastSixMonths;

    constructor(
        private theme: NbThemeService,
        private monthToLiteral: MonthToLiteralPipe,
        private saleService: SaleService,
        private datepipe: DatePipe
    ) { }

    ngOnInit() {
        this.lastSixmonths = [];
        this.salesInTheLastSixMonths = [];
        this.sales = [];
        this.getLastSixMonths();
        this.getSales();
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

    getSales() {
        this.endDate = this.datepipe.transform(this.currentDate, 'yyyy-MM-dd');
        this.getDateSixMonthsAgo();
        this.saleService.listSales('', this.startDate, this.endDate).subscribe(sales => {
            if (sales.length != 0) {
                this.sales = sales;
                this.lastSixmonths.forEach(month => {
                    var totalSales = 0;
                    this.sales.forEach(sale => {
                        var saleMonth = this.monthToLiteral.transform(new Date(sale.date).getMonth() + 1);
                        if (month == saleMonth) {
                            totalSales++;
                        }
                    });
                    this.salesInTheLastSixMonths.push(totalSales);
                });
            }
            this.generateLineChart();
        });
    }

    generateLineChart() {
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            const colors: any = config.variables;
            this.data = {
                labels: this.lastSixmonths,
                datasets: [{
                    data: this.salesInTheLastSixMonths,
                    label: 'Ventas',
                    backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                    borderColor: colors.primary,
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