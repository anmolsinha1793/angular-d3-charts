import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { BarChartComponent } from './bar-chart.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import * as d3  from 'd3';
import { CHART_OBJ } from 'src/app/shared/constants/Chart.constant';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

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
    component.data = [{"month":"January","revenue":13432,"profit":8342,"year":"2004-12-31T18:30:00.000Z"},{"month":"February","revenue":19342,"profit":10342,"year":"2005-12-31T18:30:00.000Z"},{"month":"March","revenue":17443,"profit":15423,"year":"2006-12-31T18:30:00.000Z"},{"month":"April","revenue":26342,"profit":18432,"year":"2007-12-31T18:30:00.000Z"},{"month":"May","revenue":34213,"profit":29434,"year":"2008-12-31T18:30:00.000Z"},{"month":"June","revenue":50321,"profit":45343,"year":"2009-12-31T18:30:00.000Z"},{"month":"July","revenue":54273,"profit":47452,"year":"2010-12-31T18:30:00.000Z"}];
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
    component.selectedVisualization = 'lineChart';
    expect(component.handleYAxis).toBeTruthy();
    expect(component.handleYAxis).toBeDefined();
    spyOn(component, "handleYAxis").and.callThrough();
    component.createChartLayout();
    component.handleYAxis();
    expect(component.handleYAxis).toHaveBeenCalled();
    expect(component.revenueFlag).toBeFalse();
  });
  it("should check handleYAxis function for selectedvisualization as 'scatterplot'", () => {
    component.selectedVisualization = 'scatterPlots';
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
    component.selectedVisualization = 'lineChart';
    expect(component.createChartLayout).toBeTruthy();
    expect(component.createChartLayout).toBeDefined();
    spyOn(component, "createChartLayout").and.callThrough();
    component.createChartLayout();
    expect(component.createChartLayout).toHaveBeenCalled();
    expect(component.revenueFlag).toBeTruthy();
  });
});

