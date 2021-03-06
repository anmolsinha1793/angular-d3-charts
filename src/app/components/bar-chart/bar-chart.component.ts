import { Component, OnDestroy, OnInit } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { Chart } from '../../models/chart';
import { CHART_OBJ } from '../../shared/constants/Chart.constant';

const CHART_WIDTH =
  CHART_OBJ.INITIAL_WIDTH - CHART_OBJ.MARGINS.left - CHART_OBJ.MARGINS.right;
const CHART_HEIGHT =
  CHART_OBJ.INITIAL_HEIGHT - CHART_OBJ.MARGINS.top - CHART_OBJ.MARGINS.bottom;
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, OnDestroy {
  /**
   Overall chart container
  */
  chartContainer: d3.Selection<SVGElement>;
  /**
   Overall chart group
  */
  group: d3.Selection<SVGGElement>;
  /**
   Flag to check if revenue is selected for Y axis
  */
  revenueFlag = true;
  /**
   Y label for storing Y axis label
  */
  yLabel: d3.Selection<SVGGElement>;
  /**
   for storing X axis group
  */
  xAxisGroup: d3.Selection<SVGGElement>;
  /**
   for storing Y axis group
  */
  yAxisGroup: d3.Selection<SVGGElement>;
  /**
   to store the selected chart
  */
  selectedVisualization: string;
  /**
   to store color for pie chart
  */
  colors: any;
  /**
   to store tooltip
  */
  tip: any;
  /**
   to store the content of the play/pause button
  */
  buttonText = CHART_OBJ.PLAY;
  /**
   to store fetched data from assets
  */
  data: any[];
  /**
   for storing interval data which can be cleared optionally
  */
  interval: any;
  /**
   for storing dropdown contents/options
  */
  charts: Chart[];
  /**
   for storing overall selected visualization object data
  */
  selectedObject: Chart;
  /**
   for storing text for pie chart
  */
  dataText: d3.Selection<SVGGElement>;
  /**
   for storing function names based on chart
  */
  assignmentObj = {
    barChart: CHART_OBJ.BAR_CHART_FUNCTION,
    scatterPlots: CHART_OBJ.SCATTER_PLOT_FUNCTION,
    pieChart: CHART_OBJ.PIE_CHART_FUNCTION,
    lineChart: CHART_OBJ.LINE_CHART_FUNCTION,
  };
  constructor() {}
  /**
   Life-cycle hook for angular, executes on initialization of component
   @returns void
  */
  ngOnInit(): void {
    this.selectedVisualization = CHART_OBJ.BAR_CHART_VALUE;
    this.createChartLayout();
    this.getData();
    this.charts = [
      {
        desc: CHART_OBJ.BAR_CHART_DESCRIPTION,
        value: CHART_OBJ.BAR_CHART_VALUE,
      },
      {
        desc: CHART_OBJ.SCATTER_PLOT_DESCRIPTION,
        value: CHART_OBJ.SCATTER_PLOT_VALUE,
      },
      {
        desc: CHART_OBJ.LINE_CHART_DESCRIPTION,
        value: CHART_OBJ.LINE_CHART_VALUE,
      },
      {
        desc: CHART_OBJ.PIE_CHART_DESCRIPTION,
        value: CHART_OBJ.PIE_CHART_VALUE,
      },
    ];
    this.selectedObject = this.charts.find(
      (key: any) => key.value === this.selectedVisualization
    );
  }
  /**
   Method to return transition with a set duration
   @returns transition
  */
  getTransition(): any {
    return d3.transition().duration(750);
  }
  /**
   Method to handle the selected value from dropdown
   @returns void
  */
  selectedValue({ value }): void {
    this.createChartLayout();
    this.selectedObject = this.charts.find((key: any) => key.value === value);
    this[this.assignmentObj[value]](this.data);
  }
  /**
   Method to handle the toggle for Play/Pause button
   @returns void
  */
  handleTransition(): void {
    if (this.buttonText === CHART_OBJ.PLAY) {
      this.buttonText = CHART_OBJ.PAUSE;
      this.interval = setInterval(() => {
        const newData = this.revenueFlag ? this.data : this.data.slice(1);
        this[this.assignmentObj[this.selectedVisualization]](newData);
        this.revenueFlag = !this.revenueFlag;
      }, 1000);
    } else {
      this.revenueFlag = true;
      this[this.assignmentObj[this.selectedVisualization]](this.data);
      this.buttonText = CHART_OBJ.PLAY;
      this.interval ? clearInterval(this.interval) : '';
    }
  }
  /**
   Method to create a basic chart figure
   @returns void
  */
  createChartLayout(): void {
    //* remove any existing svg element before re-rendering
    d3.selectAll('svg').remove();

    //* contructing the basic container
    this.chartContainer = d3
      .select('#chart-area')
      .append('svg')
      .attr(
        'height',
        CHART_HEIGHT + CHART_OBJ.MARGINS.top + CHART_OBJ.MARGINS.bottom
      )
      .attr(
        'width',
        (this.selectedVisualization === CHART_OBJ.LINE_CHART_VALUE
          ? CHART_WIDTH + 150
          : CHART_WIDTH) +
          CHART_OBJ.MARGINS.left +
          CHART_OBJ.MARGINS.right
      );

    this.group = this.chartContainer
      .append('g')
      .attr(
        'transform',
        `translate(${CHART_OBJ.MARGINS.left}, ${CHART_OBJ.MARGINS.top})`
      );

    this.tip = d3Tip()
      .attr('class', 'd3-tip')
      .html((e, d) => {
        let text = `<strong>Month:</strong> <span style='color:red'>${d.month}</span><br>`;
        text += `<strong>${
          this.revenueFlag ? CHART_OBJ.REVENUE : CHART_OBJ.PROFIT
        }:</strong> <span style='color:orange'>${d3.format('$,.0f')(
          this.revenueFlag ? d[CHART_OBJ.REVENUE_SMALL] : d[CHART_OBJ.PROFIT_SMALL]
        )}</span><br>`;
        // text += `<strong>Profit:</strong> <span style='color:lightgreen'>${d3.format('$,.0f')(d.profit)}</span><br>`;
        return text;
      });
    this.group.call(this.tip);
    if (this.selectedVisualization === CHART_OBJ.PIE_CHART_VALUE) {
      this.dataText = this.group
        .append('text')
        .attr('y', CHART_HEIGHT - 110)
        .attr('x', CHART_WIDTH - 310)
        .attr('font-size', '10px')
        .attr('opacity', '1')
        .attr('text-anchor', 'middle')
        .text((d) => `Data Displayed:`);
    }

    if (this.selectedVisualization !== CHART_OBJ.PIE_CHART_VALUE) {
      this.xAxisGroup = this.group
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${CHART_HEIGHT})`);

      this.yAxisGroup = this.group.append('g').attr('class', 'y axis');
      //* X label
      this.group
        .append('text')
        .attr('class', 'x axis-label')
        .attr('x', CHART_WIDTH / 2)
        .attr('y', CHART_HEIGHT + 50)
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
        .text('Month');

      //* Y label
      this.yLabel = this.group
        .append('text')
        .attr('class', 'y axis-label')
        .attr('x', -(CHART_HEIGHT / 2))
        .attr('y', -60)
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Revenue ($)');
    }
  }
  /**
   Method to fetch data from assets
   @returns void
  */
  getData(): void {
    d3.csv('assets/data/revenues.csv').then((data) => {
      this.data = data;
      const parseTime = d3.timeParse('%Y');
      this.data.forEach((d) => {
        d.revenue = Number(d.revenue);
        d.profit = +d.profit;
        d.year = parseTime(d.year);
      });

      this[this.assignmentObj[this.selectedVisualization]](this.data);
    });
  }
  /**
   Method to construct and display bar chart
   @param {data} which is fetched from assets to render
   @returns void
  */
  updateChartWithRect(data) {
    const value = this.revenueFlag ? CHART_OBJ.REVENUE_SMALL : CHART_OBJ.PROFIT_SMALL;

    const xScale = d3
      .scaleBand()
      .domain(data.map((dataPoint) => dataPoint.month))
      .rangeRound([0, CHART_WIDTH])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[value] + 3000)])
      .range([CHART_HEIGHT, 0]);

    const xAxisCall = d3.axisBottom(xScale).tickSizeOuter(0);
    this.xAxisGroup.transition(this.getTransition()).call(xAxisCall);

    const yAxisCall = d3
      .axisLeft(yScale)
      .ticks(6)
      .tickSizeOuter(0)
      .tickFormat((d) => `${d}m`);
    this.yAxisGroup.transition(this.getTransition()).call(yAxisCall);

    const rects = this.group.selectAll('rect').data(data, (d) => {
      return d?.month;
    });

    rects
      .exit()
      .attr('fill', 'red')
      .transition(this.getTransition())
      .attr('y', yScale(0))
      .attr('height', 0)
      .remove();

    //* all the attr methods before the merge are applied to the enter selection, whereas all the attr methods after the merge methods are applied to both enter and update selection
    rects
      .enter()
      .append('rect')
      .attr('x', (data) => xScale(data.month))
      .attr('width', xScale.bandwidth())
      .attr('fill', 'steelblue')
      .attr('y', yScale(0))
      .attr('height', 0)
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide)
      .merge(rects)
      .transition(this.getTransition())
      .attr('y', (data) => yScale(data[value]))
      .attr('x', (data) => xScale(data.month))
      .attr('width', xScale.bandwidth())
      .attr('height', (data) => CHART_HEIGHT - yScale(data[value]));

    const label = this.revenueFlag ? CHART_OBJ.REVENUE : CHART_OBJ.PROFIT;
    this.yLabel.text(label);
  }
   /**
   Method to handle the updation of Y axis based on chosen value
   @returns void
  */
  handleYAxis(): void {
    this.revenueFlag = !this.revenueFlag;
    this[this.assignmentObj[this.selectedVisualization]](this.data);
  }
  /**
   Method to construct and display scatter plots
   @param {data} which is fetched from assets to render
   @returns void
  */
  updateChartWithScatterPlots(data): void {
    const value = this.revenueFlag ? CHART_OBJ.REVENUE_SMALL : CHART_OBJ.PROFIT_SMALL;

    const xScale = d3
      .scaleBand()
      .domain(data.map((dataPoint) => dataPoint.month))
      .rangeRound([0, CHART_WIDTH])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[value] + 3000)])
      .range([CHART_HEIGHT, 0]);

    const xAxisCall = d3.axisBottom(xScale).tickSizeOuter(0);
    this.xAxisGroup.transition(this.getTransition()).call(xAxisCall);

    const yAxisCall = d3
      .axisLeft(yScale)
      .ticks(6)
      .tickSizeOuter(0)
      .tickFormat((d) => `${d}m`);
    this.yAxisGroup.transition(this.getTransition()).call(yAxisCall);

    const rects = this.group.selectAll('circle').data(data, (d) => {
      return d?.month;
    });

    rects
      .exit()
      .attr('fill', 'red')
      .transition(this.getTransition())
      .attr('cy', yScale(0))
      .remove();

    //* all the attr methods before the merge are applied to the enter selection, whereas all the attr methods after the merge methods are applied to both enter and update selection
    rects
      .enter()
      .append('circle')
      .attr('cx', (data) => xScale(data.month) + xScale.bandwidth() / 2)
      .attr('fill', 'steelblue')
      .attr('cy', yScale(0))
      .attr('r', 5)
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide)
      .merge(rects)
      .transition(this.getTransition())
      .attr('cy', (data) => yScale(data[value]))
      .attr('cx', (data) => xScale(data.month) + xScale.bandwidth() / 2);

    const label = this.revenueFlag ? CHART_OBJ.REVENUE : CHART_OBJ.PROFIT;
    this.yLabel.text(label);
  }
  /**
   Method to construct and display line chart
   @param {data} which is fetched from assets to render
   @returns void
  */
  updateChartWithLineGraph(data): void {
    const value = this.revenueFlag ? CHART_OBJ.REVENUE_SMALL : CHART_OBJ.PROFIT_SMALL;
    //* for tooltip
    const bisectDate = d3.bisector((d) => d.year).left;
    this.group.selectAll('path').remove();
    //* scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.year))
      .rangeRound([0, CHART_WIDTH]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[value] + 3000)])
      .range([CHART_HEIGHT, 0]);

    //* axis generators
    const xAxisCall = d3.axisBottom().tickSizeOuter(0);
    const yAxisCall = d3
      .axisLeft()
      .ticks(6)
      .tickSizeOuter(0)
      .tickFormat((d) => `${d}m`);

    //* line path generator
    const line = d3
      .line()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d[value]));

    //* generate axes once scales have been set
    this.xAxisGroup.call(xAxisCall.scale(xScale));
    this.yAxisGroup.transition(this.getTransition()).call(yAxisCall.scale(yScale));

    //* add line to chart
    this.group
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', '3px')
      .attr('d', line(data));

    /******************************** Tooltip Code ********************************/

    const focus = this.group
      .append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus
      .append('line')
      .attr('class', 'x-hover-line hover-line')
      .attr('y1', 0)
      .attr('y2', CHART_HEIGHT);

    focus
      .append('line')
      .attr('class', 'y-hover-line hover-line')
      .attr('x1', 0)
      .attr('x2', CHART_WIDTH);

    focus.append('circle').attr('r', 7.5);

    focus
      .append('rect')
      .attr('class', 'tooltip')
      .attr('width', 125)
      .attr('height', 50)
      .attr('x', 10)
      .attr('y', -22)
      .attr('rx', 4)
      .attr('ry', 4);

    focus
      .append('text')
      .attr('x', 15)
      .attr('class', 'line__chart__text')
      .attr('dy', '.31em');

    this.group
      .append('rect')
      .attr('class', 'overlay')
      .attr('id', 'tooltip__linechart')
      .attr('width', CHART_WIDTH + 110)
      .attr('height', CHART_HEIGHT + 110)
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', (e) =>
        this.mousemove(e, bisectDate, data, xScale, yScale, value, focus)
      );
    const label = this.revenueFlag ? CHART_OBJ.REVENUE : CHART_OBJ.PROFIT;
    this.yLabel.text(label);
  }
  /**
   Function to handle tooltip mousemove event
   @param {e} which is the event
   @param {bisectDate} which is the a passed function to handle tooltip for line chart
   @param {data} which is the data fetched from assets to render
   @param {xScale} which is the computed x scale value
   @param {yScale} which is the computed y scale value
   @param {value} which is the selected value,i.e, revenue/profit
   @param {focus} which is the focus element which consists of tooltip
   @returns void
  */
  mousemove(e, bisectDate, data, xScale, yScale, value, focus): void {
    const x0 = xScale.invert(d3.pointer(e)[0]);
    const i = bisectDate(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    const d = x0 - d0?.year > d1?.year - x0 ? d1 : d0;
    focus.attr(
      'transform',
      `translate(${xScale(d.year)}, ${yScale(d[value])})`
    );
    focus
      .select('text')
      .text(
        `${this.revenueFlag ? CHART_OBJ.REVENUE : CHART_OBJ.PROFIT}: ${d[value]}m`
      );
    focus.select('.x-hover-line').attr('y2', CHART_HEIGHT - yScale(d[value]));
    focus.select('.y-hover-line').attr('x2', -xScale(d.year));
  }
  /**
   Method to construct and display Pie Chart
   @param {data} which is fetched from assets to render
   @returns void
  */
  updateChartWithPieChart(data): void {
    const value = this.revenueFlag ? CHART_OBJ.REVENUE_SMALL : CHART_OBJ.PROFIT_SMALL;
    this.createColors(data);
    //* remove any existing legend
    d3.selectAll('.legend').remove();
    this.group.attr(
      'transform',
      `translate(${CHART_WIDTH / 2},${CHART_HEIGHT / 2})`
    );
    const radius = Math.min(CHART_WIDTH, CHART_HEIGHT) / 2 - 10;
    //* Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d[value]));

    //* Build the pie chart
    const piechart = this.group.selectAll('pieces').data(pie(data));

    piechart
      .exit()
      .attr('fill', 'red')
      .transition(this.getTransition())
      .remove();

    piechart
      .enter()
      .append('path')
      .attr('margin', '30px')
      .attr('d', d3.arc().innerRadius(0).outerRadius(radius))
      .attr('fill', (d, i) => this.colors(i))
      .attr('stroke', '#121926')
      .merge(piechart)
      .transition(this.getTransition())
      .style('stroke-width', '1px');

    //* Add labels
    const labelLocation = d3
      .arc()
      .innerRadius(100)
      .outerRadius(radius - 50);

    this.group
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('text')
      .text((d) => `${d.data[value]}m`)
      .attr('transform', (d) => `translate(${labelLocation.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('font-size', 13);

    this.dataText.text(`Data Displayed: ${value} in $`);
    //* function call to add legend to chart
    this.addLegendForPieChart(pie, data);
  }
   /**
   Method to render legend for Pie Chart
   @param {pie} which is instance of pie created from d3
   @param {data} which is fetched from assets to render
   @returns void
  */
  addLegendForPieChart(pie, data): void {
    // add legend
    const legendG = this.chartContainer
      .selectAll('.legend') // note appending it to mySvg and not svg to make positioning easier
      .data(pie(data))
      .enter()
      .append('g')
      .attr(
        'transform',
        (d, i) => 'translate(' + (CHART_WIDTH - 110) + ',' + (i * 15 + 20) + ')' // place each legend on the right and bump each one down 15 pixels
      )
      .attr('class', 'legend');

    legendG
      .append('rect') //* make a matching color rect
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d, i) => this.colors(i));

    legendG
      .append('text') //* add the text
      .text((d) => d.data.month)
      .style('font-size', 12)
      .style('font-weight', 'bold')
      .attr('y', 10)
      .attr('x', 15);
  }
  /**
   Method to create colors for Pie Chart
   @param {data} which is fetched from assets to render
   @returns void
  */
  private createColors(data): void {
    this.colors = d3
      .scaleOrdinal([
        '#7fc97f',
        '#beaed4',
        '#fdc086',
        '#ffff99',
        '#386cb0',
        '#f0027f',
        '#bf5b17',
        '#666666',
      ])
      .domain(data.map((d) => d.month.toString()));
  }
  /**
   Life-cycle hook for angular, executes when component gets removed from the DOM
   @returns void
  */
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
