// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ITheme } from "@fluentui/react";
import { generateRoute } from "@responsible-ai/core-ui";
import { Language } from "@responsible-ai/localization";
import { parseFeatureFlights } from "@responsible-ai/model-assessment";
import _ from "lodash";
import React from "react";
import { Redirect, generatePath } from "react-router-dom";

import { App as ErrorAnalysis } from "../error-analysis/App";
import { App as Fairness } from "../fairness/App";
import { App as InterpretText } from "../interpret-text/App";
import { App as InterpretVision } from "../interpret-vision/App";
import { App as Interpret } from "../interpret/App";
import { App as ModelAssessmentText } from "../model-assessment-text/App";
import { App as ModelAssessment } from "../model-assessment/App";

import { AppHeader } from "./AppHeader";
import { applications, IApplications, applicationKeys } from "./applications";
import { IAppSetting, noFlights, routeKey } from "./IAppSetting";
import { themes } from "./themes";

interface IAppState extends Required<IAppSetting> {
  application: keyof IApplications;
  iteration: number;
}

export class App extends React.Component<IAppSetting, IAppState> {
  public static route = generateRoute(routeKey);
  public constructor(props: IAppSetting) {
    super(props);
    this.state = this.getState({ ...this.props, iteration: 0 });
  }
  public componentDidUpdate(prevProps: IAppSetting): void {
    if (!_.isEqual(prevProps, this.props)) {
      this.setState(
        this.getState({ ...this.props, iteration: this.state.iteration })
      );
    }
  }
  public render(): React.ReactNode {
    const theme: ITheme = themes[this.state.theme];
    return (
      <>
        <AppHeader onSettingChanged={this.onSettingChanged} {...this.state} />
        <div
          style={{
            backgroundColor: theme.semanticColors.bodyBackground,
            height: "calc(100% - 70px)",
            minHeight: "500px",
            width: "calc(100%-20px)"
          }}
          key={this.state.iteration}
        >
          {this.state.application === "interpret" && (
            <Interpret
              dataset={
                applications[this.state.application].datasets[
                  this.state.dataset
                ].data
              }
              classDimension={
                applications[this.state.application].datasets[
                  this.state.dataset
                ].classDimension
              }
              theme={themes[this.state.theme]}
              language={Language[this.state.language]}
              version={
                applications[this.state.application].versions[
                  this.state.version
                ]
              }
            />
          )}
          {this.state.application === "interpretText" && (
            <InterpretText
              dataset={
                applications[this.state.application].datasets[
                  this.state.dataset
                ].data
              }
              theme={themes[this.state.theme]}
              language={Language[this.state.language]}
              version={
                applications[this.state.application].versions[
                  this.state.version
                ]
              }
            />
          )}
          {this.state.application === "interpretVision" && (
            <InterpretVision
              dataset={
                applications[this.state.application].datasets[
                  this.state.dataset
                ].data
              }
              theme={themes[this.state.theme]}
              language={Language[this.state.language]}
              version={
                applications[this.state.application].versions[
                  this.state.version
                ]
              }
            />
          )}
          {this.state.application === "fairness" && (
            <Fairness
              dataset={
                applications[this.state.application].datasets[
                  this.state.dataset
                ].data
              }
              theme={themes[this.state.theme]}
              language={Language[this.state.language]}
              version={
                applications[this.state.application].versions[
                  this.state.version
                ]
              }
            />
          )}
          {this.state.application === "errorAnalysis" && (
            <ErrorAnalysis
              dataset={
                applications[this.state.application].datasets[
                  this.state.dataset
                ].data
              }
              datasetName={this.state.dataset}
              classDimension={
                applications[this.state.application].datasets[
                  this.state.dataset
                ].classDimension
              }
              theme={theme}
              language={Language[this.state.language]}
              version={
                applications[this.state.application].versions[
                  this.state.version
                ]
              }
            />
          )}
          {this.state.application === "modelAssessment" && (
            <ModelAssessment
              {...applications[this.state.application].datasets[
                this.state.dataset
              ]}
              theme={themes[this.state.theme]}
              language={Language[this.state.language]}
              version={
                applications[this.state.application].versions[
                  this.state.version
                ]
              }
              featureFlights={
                this.state.featureFlights === noFlights
                  ? []
                  : parseFeatureFlights(this.state.featureFlights)
              }
            />
          )}
          {this.state.application === "modelAssessmentText" && (
            <ModelAssessmentText
              {...applications[this.state.application].datasets[
                this.state.dataset
              ]}
              theme={themes[this.state.theme]}
              language={Language[this.state.language]}
              version={
                applications[this.state.application].versions[
                  this.state.version
                ]
              }
              featureFlights={
                this.state.featureFlights === noFlights
                  ? []
                  : parseFeatureFlights(this.state.featureFlights)
              }
            />
          )}
        </div>
        <Redirect to={generatePath(App.route, this.state)} push />
      </>
    );
  }
  private onSettingChanged = <T extends keyof IAppSetting>(
    field: T,
    value: IAppSetting[T]
  ): void => {
    this.setState((prev: IAppState) => {
      const newState = { ...prev, [field]: value };
      return this.getState(newState);
    });
  };

  private getState(props: IAppSetting & { iteration: number }): IAppState {
    const idx = applicationKeys.indexOf(
      props.application as keyof IApplications
    );
    const application: keyof IApplications =
      idx < 0 ? "interpret" : applicationKeys[idx];
    return {
      application,
      dataset:
        !props.dataset || !applications[application].datasets[props.dataset]
          ? Object.keys(applications[application].datasets)[0]
          : props.dataset,
      featureFlights: props.featureFlights ?? noFlights,
      iteration: props.iteration + 1,
      language:
        !props.language || !Language[props.language]
          ? Language.En
          : props.language,
      theme:
        !props.theme || !themes[props.theme]
          ? Object.keys(themes)[0]
          : props.theme,
      version:
        !props.version || !applications[application].versions[props.version]
          ? Object.keys(applications[application].versions)[0]
          : props.version
    };
  }
}
