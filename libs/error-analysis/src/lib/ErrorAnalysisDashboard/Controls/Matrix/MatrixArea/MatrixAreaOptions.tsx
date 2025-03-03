// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DefaultButton, IStackTokens, Stack } from "@fluentui/react";
import {
  defaultModelAssessmentContext,
  ITelemetryEvent,
  ModelAssessmentContext
} from "@responsible-ai/core-ui";
import { localization } from "@responsible-ai/localization";
import React from "react";

import { MatrixOptions } from "../MatrixOptions/MatrixOptions";

interface IMatrixAreaOptionsProps {
  disableClearAll: boolean;
  disableSelectAll: boolean;
  isEnabled: boolean;
  numBins: number;
  quantileBinning: boolean;
  telemetryHook?: (message: ITelemetryEvent) => void;
  clearAll(): void;
  selectAll(): void;
  updateNumBins(numBins: number): void;
  updateQuantileBinning(quantileBinning: boolean): void;
}

const stackTokens: IStackTokens = { childrenGap: "l1" };

export class MatrixAreaOptions extends React.PureComponent<IMatrixAreaOptionsProps> {
  public static contextType = ModelAssessmentContext;
  public context: React.ContextType<typeof ModelAssessmentContext> =
    defaultModelAssessmentContext;

  public render(): React.ReactNode {
    return (
      <Stack horizontal tokens={stackTokens} verticalAlign="center">
        <DefaultButton
          text={localization.ErrorAnalysis.MatrixArea.clearAll}
          onClick={this.props.clearAll}
          disabled={this.props.disableClearAll}
        />
        <DefaultButton
          text={localization.ErrorAnalysis.MatrixArea.selectAll}
          onClick={this.props.selectAll}
          disabled={this.props.disableSelectAll}
        />
        <MatrixOptions
          quantileBinning={this.props.quantileBinning}
          binningThreshold={this.props.numBins}
          updateQuantileBinning={this.props.updateQuantileBinning}
          updateNumBins={this.props.updateNumBins}
          isEnabled={this.props.isEnabled}
          telemetryHook={this.props.telemetryHook}
        />
      </Stack>
    );
  }
}
