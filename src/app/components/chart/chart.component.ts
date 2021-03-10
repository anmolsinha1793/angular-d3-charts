import { Component, OnDestroy, OnInit } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { Chart } from '../../models/chart';
import { CHART_OBJ } from '../../shared/constants/Chart.constant';
import { fromEvent, Observable, Subscription } from "rxjs";


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
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
    groupedBarChart: CHART_OBJ.GROUPED_BAR_CHART_FUNCTION
  };
  /**
   for storing chart overall width
  */
  CHART_WIDTH =
  CHART_OBJ.INITIAL_WIDTH - CHART_OBJ.MARGINS.left - CHART_OBJ.MARGINS.right;
  /**
   for storing chart overall height
  */
  CHART_HEIGHT =
  CHART_OBJ.INITIAL_HEIGHT - CHART_OBJ.MARGINS.top - CHART_OBJ.MARGINS.bottom;
  /**
   for the resize event observable
  */
  resizeObservable$: Observable<Event>;
  /**
   for storing resize event observable subscription
  */
  resizeSubscription$: Subscription;

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
      {
        desc: CHART_OBJ.GROUPED_BAR_CHART_DESCRIPTION,
        value: CHART_OBJ.GROUPED_BAR_CHART_VALUE,
      },
    ];
    this.selectedObject = this.charts.find(
      (key: any) => key.value === this.selectedVisualization
    );
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.onResize(evt);
    })
  }
  /**
   Method to resize the charts on screen size change
   @returns void
  */
  onResize(event): void {
    CHART_OBJ.INITIAL_WIDTH = CHART_OBJ.NUMERIC_06 * event.target.innerWidth;
    CHART_OBJ.INITIAL_HEIGHT = (event.target.innerHeight > event.target.innerWidth) && (event.target.innerHeight - event.target.innerWidth >= CHART_OBJ.NUMERIC_350)? CHART_OBJ.NUMERIC_07 * (event.target.innerHeight - event.target.innerWidth): CHART_OBJ.NUMERIC_08 * event.target.innerHeight;
    this.CHART_WIDTH =
    CHART_OBJ.INITIAL_WIDTH - CHART_OBJ.MARGINS.left - CHART_OBJ.MARGINS.right;
    this.CHART_HEIGHT =
    CHART_OBJ.INITIAL_HEIGHT - CHART_OBJ.MARGINS.top - CHART_OBJ.MARGINS.bottom;
    this.createChartLayout();
    this[this.assignmentObj[this.selectedVisualization]](this.data);
  }
  /**
   Method to return transition with a set duration
   @returns transition
  */
  getTransition(): any {
    return d3.transition().duration(CHART_OBJ.NUMERIC_750);
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
      }, CHART_OBJ.SETINTERVAL_VALUE);
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
      .attr('id','chart__svg')
      .attr(
        'height',
        this.CHART_HEIGHT + CHART_OBJ.MARGINS.top + CHART_OBJ.MARGINS.bottom
      )
      .attr(
        'width',
        (this.selectedVisualization === CHART_OBJ.LINE_CHART_VALUE
          ? this.CHART_WIDTH + CHART_OBJ.LINE_CHART_EXTRA_WIDTH_150
          : this.CHART_WIDTH) +
          CHART_OBJ.MARGINS.left +
          CHART_OBJ.MARGINS.right
      )

  let zoom = d3.zoom()
  .translateExtent([[CHART_OBJ.TRANSLATE_EXTENT_MINUS_500, CHART_OBJ.TRANSLATE_EXTENT_MINUS_300], [CHART_OBJ.TRANSLATE_EXTENT_1500, CHART_OBJ.TRANSLATE_EXTENT_1000]])
  .scaleExtent([1, 2])
   .on('zoom', (e) => {
    this.chartContainer.attr('transform', e.transform)
   });
   this.chartContainer.call(zoom);

    this.group = this.chartContainer
      .append('g')
      .attr(
        'transform',
        `translate(${CHART_OBJ.MARGINS.left}, ${CHART_OBJ.MARGINS.top})`
      );

    this.tip = d3Tip()
      .attr('class', 'd3-tip')
      .html((e, d) => {
        let text = '';
        if(this.selectedVisualization !== CHART_OBJ.GROUPED_BAR_CHART_VALUE){
          text = `<strong>Month:</strong> <span style='color:red'>${d.month}</span><br>`;
        text += `<strong>${
          this.revenueFlag ? CHART_OBJ.REVENUE : CHART_OBJ.PROFIT
        }:</strong> <span style='color:orange'>${d3.format('$,.0f')(
          this.revenueFlag ? d[CHART_OBJ.REVENUE_SMALL] : d[CHART_OBJ.PROFIT_SMALL]
        )}</span><br>`;
        } else {
          text += `<strong>Population:</strong> <span style='color:orange'>${d3.format('.0f')(
            d.value
          )}</span><br>`;
        }
        return text;
      });
    this.group.call(this.tip);
    if (this.selectedVisualization === CHART_OBJ.PIE_CHART_VALUE) {
      this.dataText = this.group
        .append('text')
        .attr('y', this.CHART_HEIGHT/2)
        .attr('x', this.CHART_WIDTH/2)
        .attr('font-size', '10px')
        .attr('opacity', '1')
        .attr('text-anchor', 'middle')
        .text((d) => `Data Displayed:`);
    }

    if (this.selectedVisualization !== CHART_OBJ.PIE_CHART_VALUE) {
      this.xAxisGroup = this.group
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${this.CHART_HEIGHT})`);

      this.yAxisGroup = this.group.append('g').attr('class', 'y axis');
      //* X label
      this.group
        .append('text')
        .attr('class', 'x axis-label')
        .attr('x', this.CHART_WIDTH / CHART_OBJ.NUMERIC_2)
        .attr('y', this.CHART_HEIGHT + CHART_OBJ.NUMERIC_50)
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
        .text('Month');

      //* Y label
      this.yLabel = this.group
        .append('text')
        .attr('class', 'y axis-label')
        .attr('x', -(this.CHART_HEIGHT / CHART_OBJ.NUMERIC_2))
        .attr('y', -CHART_OBJ.NUMERIC_60)
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
        d.Under_5_Years = Number(d.Under_5_Years)/CHART_OBJ.NUMERIC_100;
        d._5_to_25_Years = Number(d._5_to_25_Years)/CHART_OBJ.NUMERIC_100;
        d._25_to_45_Years = Number(d._25_to_45_Years)/CHART_OBJ.NUMERIC_100;
        d._45_Years_and_Over = Number(d._45_Years_and_Over)/CHART_OBJ.NUMERIC_100;
      });
      this.data['groupKey'] = this.data['columns'][8];
      this.data['keys'] = this.data['columns'].slice(4,8);

      this[this.assignmentObj[this.selectedVisualization]](this.data);
    });
  }
  /**
   Method to construct and display bar chart
   @param {data} which is fetched from assets to render
   @returns void
  */
   updateChartWithBarChart(data) {
    const value = this.revenueFlag ? CHART_OBJ.REVENUE_SMALL : CHART_OBJ.PROFIT_SMALL;

    const xScale = d3
      .scaleBand()
      .domain(data.map((dataPoint) => dataPoint.month))
      .rangeRound([0, this.CHART_WIDTH])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[value] + CHART_OBJ.NUMERIC_3000)])
      .range([this.CHART_HEIGHT, 0]);

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
      .attr('id', 'barchart__tooltip')
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
      .attr('height', (data) => this.CHART_HEIGHT - yScale(data[value]));

    const label = this.revenueFlag ? CHART_OBJ.REVENUE : CHART_OBJ.PROFIT;
    this.yLabel.text(label);
  }
  /**
   Method to construct and display grouped bar chart
   @param {data} which is fetched from assets to render
   @returns void
  */
  updateChartWithGroupedBarChart(data): void {
    let groupKey = data['groupKey'];
    //* get keys for legend
    let keys = data['columns'].slice(4,8);

    //* prepare X and Y scales
    var xScale0 = d3.scaleBand().range([0, this.CHART_WIDTH]).padding(0.2)
    var xScale1 = d3.scaleBand().padding(0.05)
    var yScale = d3.scaleLinear().range([this.CHART_HEIGHT, 0])

    //* prepare X and Y axis calls
    var xAxis = d3.axisBottom(xScale0).tickSizeOuter(0);
    var yAxis = d3.axisLeft(yScale).ticks(CHART_OBJ.NUMERIC_7).tickFormat((d) => `${d}m`).tickSizeOuter(0);

    //* customize X and Y scale domains
    xScale0.domain(data.map(d => d[groupKey]))
    xScale1.domain(keys).range([0, xScale0.bandwidth()])
    yScale.domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()

    //* X and Y axis calls
    this.xAxisGroup.transition(this.getTransition()).call(xAxis);
    this.yAxisGroup.transition(this.getTransition()).call(yAxis);

    //* Prepare color for chart
    let color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    const rects =  this.group.append("g")
    .selectAll("g")
    .data(data, (d) => {
      return d?.month;
    });

    //* append data to group and prepare bars for chart
    rects
    .join("g")
      .attr("transform", d => `translate(${xScale0(d[groupKey])},0)`)
    .selectAll("rect")
    .data(d => keys.map(key => ({key, value: d[key]})))
    .join("rect")
      .attr('id','grouped__bar__chart')
      .attr("x", d => xScale1(d.key))
      .attr('y', yScale(0))
      .attr('height', 0)
      .attr("width", xScale1.bandwidth())
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide)
      .attr("fill", d => color(d.key))
      .merge(rects)
      .transition(this.getTransition())
      .attr("x", d => xScale1(d.key))
      .attr("y", d => yScale(d.value))
      .attr("height", d => yScale(0) - yScale(d.value));


    //* prepare legend
    const legend = this.chartContainer
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", CHART_OBJ.NUMERIC_10)
      .selectAll('.legend')
      .data(keys.slice())
      .enter()
      .append('g')
      .attr(
        'transform',
        (d, i) => `translate(${(this.CHART_WIDTH + CHART_OBJ.NUMERIC_90)}, ${(i * CHART_OBJ.NUMERIC_20)})` //* place each legend on the right and bump each one down 15 pixels
      )
      .attr('class', 'legend');

      //* append rects for color in legend
      legend.append("rect")
      .attr("x", -CHART_OBJ.NUMERIC_19)
      .attr("width", CHART_OBJ.NUMERIC_19)
      .attr("height", CHART_OBJ.NUMERIC_19)
      .attr("fill", color);

      //* Append text to legend
      legend.append("text")
      .attr("x", -CHART_OBJ.NUMERIC_24)
      .attr("y", 9.5)
      .attr("dy", "0.35em")
      .text(d => d.split("_").join(" "));

      //* change y axis label
      this.yLabel.text(CHART_OBJ.POPULATION_TEXT);

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
      .rangeRound([0, this.CHART_WIDTH])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[value] + CHART_OBJ.NUMERIC_3000)])
      .range([this.CHART_HEIGHT, 0]);

    const xAxisCall = d3.axisBottom(xScale).tickSizeOuter(0);
    this.xAxisGroup.transition(this.getTransition()).call(xAxisCall);

    const yAxisCall = d3
      .axisLeft(yScale)
      .ticks(CHART_OBJ.NUMERIC_6)
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
      .attr('cx', (data) => xScale(data.month) + xScale.bandwidth() / CHART_OBJ.NUMERIC_2);

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
    this.group.selectAll('#dot').remove();
    //* scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.year))
      .rangeRound([0, this.CHART_WIDTH]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[value] + CHART_OBJ.NUMERIC_3000)])
      .range([this.CHART_HEIGHT, 0]);

    //* axis generators
    const xAxisCall = d3.axisBottom().tickSizeOuter(0);
    const yAxisCall = d3
      .axisLeft()
      .ticks(CHART_OBJ.NUMERIC_6)
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

    //* optionally add circular dots to the line-chart, comment if not needed
    this.group.selectAll("#dot")
      .data(data)
    .enter().append("circle") // Uses the enter().append() method
      .attr("id", "dot") // Assign a class for styling
      .attr("cx", (d, i) => xScale(d.year))
      .attr("cy", (d) => yScale(d[value]))
      .attr("r", 5)

    /******************************** Tooltip Code ********************************/

    const focus = this.group
      .append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus
      .append('line')
      .attr('class', 'x-hover-line hover-line')
      .attr('y1', 0)
      .attr('y2', this.CHART_HEIGHT);

    focus
      .append('line')
      .attr('class', 'y-hover-line hover-line')
      .attr('x1', 0)
      .attr('x2', this.CHART_WIDTH);

    focus.append('circle').attr('r', 7.5);

    focus
      .append('rect')
      .attr('class', 'tooltip')
      .attr('width', CHART_OBJ.NUMERIC_125)
      .attr('height', CHART_OBJ.NUMERIC_50)
      .attr('x', CHART_OBJ.NUMERIC_10)
      .attr('y', -CHART_OBJ.NUMERIC_22)
      .attr('rx', CHART_OBJ.NUMERIC_4)
      .attr('ry', CHART_OBJ.NUMERIC_4);

    focus
      .append('text')
      .attr('x', CHART_OBJ.NUMERIC_15)
      .attr('class', 'line__chart__text')
      .attr('dy', '.31em');

    this.group
      .append('rect')
      .attr('class', 'overlay')
      .attr('id', 'tooltip__linechart')
      .attr('width', this.CHART_WIDTH + CHART_OBJ.NUMERIC_110)
      .attr('height', this.CHART_HEIGHT + CHART_OBJ.NUMERIC_110)
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
    focus.select('.x-hover-line').attr('y2', this.CHART_HEIGHT - yScale(d[value]));
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
      `translate(${this.CHART_WIDTH / CHART_OBJ.NUMERIC_2},${this.CHART_HEIGHT / CHART_OBJ.NUMERIC_2})`
    );
    const radius = Math.min(this.CHART_WIDTH, this.CHART_HEIGHT) / CHART_OBJ.NUMERIC_2 - CHART_OBJ.NUMERIC_10;
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
      .innerRadius(CHART_OBJ.NUMERIC_100)
      .outerRadius(radius - CHART_OBJ.NUMERIC_50);

    this.group
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('text')
      .text((d) => `${d.data[value]}m`)
      .attr('transform', (d) => `translate(${labelLocation.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('font-size', CHART_OBJ.NUMERIC_13);

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
    let legendRectSize = CHART_OBJ.NUMERIC_18;
    let legendSpacing = CHART_OBJ.NUMERIC_4;
    const horizontalScale = this.CHART_WIDTH * CHART_OBJ.NUMERIC_01;
    const verticalScale = this.CHART_HEIGHT * CHART_OBJ.NUMERIC_045;
    const domaninLength = d3
    .scaleOrdinal([
      '#7fc97f',
      '#beaed4',
      '#fdc086',
      '#ffff99',
      '#386cb0',
      '#f0027f',
      '#bf5b17',
      '#666666',
    ]).domain().length;

      //* construct legend
      let legend = this.group
      .selectAll('.legend')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => {
        let height = legendRectSize + legendSpacing;
        let offset =  height * domaninLength / CHART_OBJ.NUMERIC_2;
        let horz = CHART_OBJ.NUMERIC_10 * legendRectSize + horizontalScale;
        let vert = i * height - offset - verticalScale;
        return `translate(${horz} , ${vert})`;
      });

      //* append rects to legend
    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', (d, i) => this.colors(i))

      //* append text to legend
    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .style('font-size', CHART_OBJ.NUMERIC_12)
      .style('font-weight', 'bold')
      .text((d) => d.data.month);
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
    this.resizeSubscription$.unsubscribe();
    clearInterval(this.interval);
  }
}
