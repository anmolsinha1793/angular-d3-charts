import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { BarChartComponent } from './chart.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CHART_OBJ } from 'src/app/shared/constants/Chart.constant';
import * as d3 from 'd3';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;
  const spy = jasmine.createSpy();

  beforeAll(() => {
    window.addEventListener('resize', spy);
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, MatSelectModule, NoopAnimationsModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ BarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //* mock data
    component.data = [{"month":"January","revenue":13432,"profit":8342,"year":"2004-12-31T18:30:00.000Z","Under_5_Years":2704659,"_5_to_25_Years":4499890,"_25_to_45_Years":2159981,"_45_Years_and_Over":3853788},{"month":"February","revenue":19342,"profit":10342,"year":"2005-12-31T18:30:00.000Z","Under_5_Years":2027307,"_5_to_25_Years":3277946,"_25_to_45_Years":1420518,"_45_Years_and_Over":2454721},{"month":"March","revenue":17443,"profit":15423,"year":"2006-12-31T18:30:00.000Z","Under_5_Years":1208495,"_5_to_25_Years":2141490,"_25_to_45_Years":1058031,"_45_Years_and_Over":1999120},{"month":"April","revenue":26342,"profit":18432,"year":"2007-12-31T18:30:00.000Z","Under_5_Years":1140516,"_5_to_25_Years":1938695,"_25_to_45_Years":925060,"_45_Years_and_Over":1607297},{"month":"May","revenue":34213,"profit":29434,"year":"2008-12-31T18:30:00.000Z","Under_5_Years":894368,"_5_to_25_Years":1558919,"_25_to_45_Years":725973,"_45_Years_and_Over":1311479},{"month":"June","revenue":50321,"profit":45343,"year":"2009-12-31T18:30:00.000Z","Under_5_Years":737462,"_5_to_25_Years":1345341,"_25_to_45_Years":679201,"_45_Years_and_Over":1203944},{"month":"July","revenue":54273,"profit":47452,"year":"2010-12-31T18:30:00.000Z","Under_5_Years":894368,"_5_to_25_Years":925060,"_25_to_45_Years":1420518,"_45_Years_and_Over":2159981}];
    component.data['columns'] = ["month", "revenue", "profit", "year", "Under_5_Years", "_5_to_25_Years", "_25_to_45_Years", "_45_Years_and_Over"];
    window.dispatchEvent(new Event('resize'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should check selectedValue function", () => {
    let obj = {
      value: 'barChart'
    }
    let selctedObjVal = {
      desc: CHART_OBJ.BAR_CHART_DESCRIPTION,
      value: CHART_OBJ.BAR_CHART_VALUE,
    }
    expect(component.selectedValue).toBeTruthy();
    expect(component.selectedValue).toBeDefined();
    spyOn(component, "selectedValue").and.callThrough();
    component.selectedValue(obj);
    expect(component.selectedValue).toHaveBeenCalled();
    expect(component.selectedObject).toEqual(selctedObjVal);
    const resultSvg = document.getElementById('barchart__tooltip');
    // handled d3 tip
    resultSvg.dispatchEvent(new MouseEvent('mouseover'));
    resultSvg.dispatchEvent(new MouseEvent('mouseout'));
    resultSvg.dispatchEvent(new MouseEvent('mousemove'));
    expect(resultSvg).toBeDefined();
    const chartSvg = document.getElementById('chart__svg');
    //handled zoom event d3
    chartSvg.dispatchEvent(new MouseEvent('wheel'));
    chartSvg.dispatchEvent(new MouseEvent('dblclick'));
    expect(chartSvg).toBeDefined();
  });
  it("should check selectedValue function for false revenue flag", () => {
    let obj = {
      value: 'barChart'
    }
    let selctedObjVal = {
      desc: CHART_OBJ.BAR_CHART_DESCRIPTION,
      value: CHART_OBJ.BAR_CHART_VALUE,
    }
    component.revenueFlag = false;
    expect(component.selectedValue).toBeTruthy();
    expect(component.selectedValue).toBeDefined();
    spyOn(component, "selectedValue").and.callThrough();
    component.selectedValue(obj);
    expect(component.selectedValue).toHaveBeenCalled();
    expect(component.selectedObject).toEqual(selctedObjVal);
    const resultSvg = document.getElementById('barchart__tooltip');
    resultSvg.dispatchEvent(new MouseEvent('mouseover'));
    resultSvg.dispatchEvent(new MouseEvent('mouseout'));
    resultSvg.dispatchEvent(new MouseEvent('mousemove'));
    expect(resultSvg).toBeDefined();
  });
  it("should check handleTransition function for Play button text", (done) => {
    component.buttonText = CHART_OBJ.PLAY;
    component.revenueFlag = true;
    expect(component.handleTransition).toBeTruthy();
    expect(component.handleTransition).toBeDefined();
    spyOn(component, "handleTransition").and.callThrough();
    component.handleTransition();
    expect(component.handleTransition).toHaveBeenCalled();
    setTimeout(function() {
      expect(component.revenueFlag).toEqual(false);
      done();
    }, 1005);
    expect(component.buttonText).toEqual(CHART_OBJ.PAUSE);
  });
  it("should check handleTransition function for Play button text and false revenue flag", (done) => {
    component.buttonText = CHART_OBJ.PLAY;
    component.revenueFlag = false;
    expect(component.handleTransition).toBeTruthy();
    expect(component.handleTransition).toBeDefined();
    spyOn(component, "handleTransition").and.callThrough();
    component.handleTransition();
    expect(component.handleTransition).toHaveBeenCalled();
    setTimeout(function() {
      expect(component.revenueFlag).toEqual(true);
      done();
    }, 1005);
    expect(component.buttonText).toEqual(CHART_OBJ.PAUSE);
  });
  it("should check handleTransition function for Pause button text", () => {
    component.buttonText = CHART_OBJ.PAUSE;
    expect(component.handleTransition).toBeTruthy();
    expect(component.handleTransition).toBeDefined();
    spyOn(component, "handleTransition").and.callThrough();
    component.handleTransition();
    expect(component.handleTransition).toHaveBeenCalled();
    expect(component.buttonText).toEqual(CHART_OBJ.PLAY);
  });
  it("should check handleTransition function for Pause button text for interval value", () => {
    component.buttonText = CHART_OBJ.PAUSE;
    component.interval = setInterval(()=>{},0);
    expect(component.handleTransition).toBeTruthy();
    expect(component.handleTransition).toBeDefined();
    spyOn(component, "handleTransition").and.callThrough();
    component.handleTransition();
    expect(component.handleTransition).toHaveBeenCalled();
    expect(component.buttonText).toEqual(CHART_OBJ.PLAY);
  });
  it("should check createChartLayout function for selectedvisualization as 'pieChart'", () => {
    component.selectedVisualization = CHART_OBJ.PIE_CHART_VALUE;
    expect(component.createChartLayout).toBeTruthy();
    expect(component.createChartLayout).toBeDefined();
    spyOn(component, "createChartLayout").and.callThrough();
    component.createChartLayout();
    expect(component.createChartLayout).toHaveBeenCalled();
    expect(component.chartContainer).toBeDefined();
    expect(component.group).toBeDefined();
    expect(component.xAxisGroup).toBeDefined();
    expect(component.yAxisGroup).toBeDefined();
  });
  it("should check handleYAxis function", () => {
    component.selectedVisualization = CHART_OBJ.LINE_CHART_VALUE;
    expect(component.handleYAxis).toBeTruthy();
    expect(component.handleYAxis).toBeDefined();
    spyOn(component, "handleYAxis").and.callThrough();
    component.handleYAxis();
    expect(component.handleYAxis).toHaveBeenCalled();
    expect(component.revenueFlag).toBeFalse();
  });
  it("should check handleYAxis function for selectedvisualization as 'scatterplot'", () => {
    component.selectedVisualization = CHART_OBJ.SCATTER_PLOT_VALUE;
    expect(component.handleYAxis).toBeTruthy();
    expect(component.handleYAxis).toBeDefined();
    spyOn(component, "handleYAxis").and.callThrough();
    component.handleYAxis();
    expect(component.handleYAxis).toHaveBeenCalled();
    expect(component.revenueFlag).toBeFalsy();
  });
  it("should check updateChartWithScatterPlots function for revenue flag true", () => {
    component.revenueFlag = true;
    expect(component.updateChartWithScatterPlots).toBeTruthy();
    expect(component.updateChartWithScatterPlots).toBeDefined();
    spyOn(component, "updateChartWithScatterPlots").and.callThrough();
    component.updateChartWithScatterPlots(component.data);
    expect(component.updateChartWithScatterPlots).toHaveBeenCalled();
    expect(component.yLabel).toBeDefined();
    expect(component.revenueFlag).toBeTruthy();
  });
  it("should check updateChartWithLineGraph function for revenue flag true", () => {
    component.revenueFlag = true;
    expect(component.updateChartWithLineGraph).toBeTruthy();
    expect(component.updateChartWithLineGraph).toBeDefined();
    spyOn(component, "updateChartWithLineGraph").and.callThrough();
    component.updateChartWithLineGraph(component.data);
    expect(component.updateChartWithLineGraph).toHaveBeenCalled();
    const resultSvg = document.getElementById('tooltip__linechart');
    resultSvg.dispatchEvent(new MouseEvent('mouseover'));
    resultSvg.dispatchEvent(new MouseEvent('mouseout'));
    resultSvg.dispatchEvent(new MouseEvent('mousemove'));
    const circle = document.getElementById('dot');
    circle.dispatchEvent(new MouseEvent('mouseover'));
    circle.dispatchEvent(new MouseEvent('mouseout'));
    expect(circle).toBeDefined();
    expect(resultSvg).toBeDefined();
    expect(component.revenueFlag).toBeTruthy();
  });
  it("should check updateChartWithLineGraph function for revenue flag false", () => {
    component.revenueFlag = false;
    expect(component.updateChartWithLineGraph).toBeTruthy();
    expect(component.updateChartWithLineGraph).toBeDefined();
    spyOn(component, "updateChartWithLineGraph").and.callThrough();
    component.updateChartWithLineGraph(component.data);
    expect(component.updateChartWithLineGraph).toHaveBeenCalled();
    //* mocking events
    const resultSvg = document.getElementById('tooltip__linechart');
    resultSvg.dispatchEvent(new MouseEvent('mouseover'));
    resultSvg.dispatchEvent(new MouseEvent('mouseout'));
    resultSvg.dispatchEvent(new MouseEvent('mousemove'));
    expect(resultSvg).toBeDefined();
    expect(component.revenueFlag).toBeFalsy();
  });
  it("should check updateChartWithPieChart function for revenue flag false", () => {
    component.revenueFlag = false;
    component.dataText = {
      text: (val) => {

      }
    }
    expect(component.updateChartWithPieChart).toBeTruthy();
    expect(component.updateChartWithPieChart).toBeDefined();
    spyOn(component, "updateChartWithPieChart").and.callThrough();
    component.updateChartWithPieChart(component.data);
    expect(component.updateChartWithPieChart).toHaveBeenCalled();
    expect(component.revenueFlag).toBeFalsy();
  });
  it("should check createChartLayout function for revenue flag false", () => {
    component.selectedVisualization = CHART_OBJ.LINE_CHART_VALUE;
    expect(component.createChartLayout).toBeTruthy();
    expect(component.createChartLayout).toBeDefined();
    spyOn(component, "createChartLayout").and.callThrough();
    component.createChartLayout();
    expect(component.createChartLayout).toHaveBeenCalled();
    expect(component.revenueFlag).toBeTruthy();
    const resultSvg = document.getElementById('chart-area');
    resultSvg.dispatchEvent(new Event('zoom'));
    expect(resultSvg).toBeDefined();
    const tip = document.getElementsByClassName('d3-tip');
    expect(tip).toBeDefined();
  });
  it('should trigger onResize method when window is resized', () => {
    const spyOnResize = spyOn(component, 'onResize');
    expect(component.onResize).toBeDefined();
    expect(spy).toHaveBeenCalled();
  });
  it("should check updateChartWithGroupedBarChart function for revenue flag true", () => {
    component.revenueFlag = true;
    component.selectedVisualization = CHART_OBJ.GROUPED_BAR_CHART_VALUE;
    expect(component.updateChartWithGroupedBarChart).toBeTruthy();
    expect(component.updateChartWithGroupedBarChart).toBeDefined();
    spyOn(component, "updateChartWithGroupedBarChart").and.callThrough();
    component.updateChartWithGroupedBarChart(component.data);
    expect(component.updateChartWithGroupedBarChart).toHaveBeenCalled();
    expect(component.yLabel).toBeDefined();
    expect(component.revenueFlag).toBeTruthy();
    const resultSvg = document.getElementById('grouped__bar__chart');
    resultSvg.dispatchEvent(new MouseEvent('mouseover'));
    resultSvg.dispatchEvent(new MouseEvent('mouseout'));
    resultSvg.dispatchEvent(new MouseEvent('mousemove'));
    expect(resultSvg).toBeDefined();
  });
});

