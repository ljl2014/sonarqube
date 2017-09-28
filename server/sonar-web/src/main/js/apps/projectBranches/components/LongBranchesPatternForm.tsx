/*
 * SonarQube
 * Copyright (C) 2009-2016 SonarSource SA
 * mailto:contact AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import * as React from 'react';
import Modal from 'react-modal';
import { translate, translateWithParameters } from '../../../helpers/l10n';
import { setSimpleSettingValue, resetSettingValue, SettingValue } from '../../../api/settings';
import { LONG_BRANCH_PATTERN } from './LongBranchesPattern';

interface Props {
  onChange: () => void;
  onClose: () => void;
  project: string;
  setting: SettingValue;
}

interface State {
  submitting: boolean;
  value: string;
}

export default class LongBranchesPatternForm extends React.PureComponent<Props, State> {
  mounted: boolean;

  constructor(props: Props) {
    super(props);
    this.state = { submitting: false, value: props.setting.value || '' };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState({ submitting: true });
    const { value } = this.state;
    setSimpleSettingValue({
      key: LONG_BRANCH_PATTERN,
      value,
      component: this.props.project
    }).then(this.props.onChange, () => {
      if (this.mounted) {
        this.setState({ submitting: false });
      }
    });
  };

  handleValueChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ value: event.currentTarget.value });
  };

  handleCancelClick = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.onClose();
  };

  handleResetClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.blur();
    this.setState({ submitting: true });
    resetSettingValue(LONG_BRANCH_PATTERN, this.props.project).then(this.props.onChange, () => {
      if (this.mounted) {
        this.setState({ submitting: false });
      }
    });
  };

  render() {
    const { setting } = this.props;
    const header = translate('branches.detection_of_long_living_branches');
    const submitDisabled = this.state.submitting || this.state.value === setting.value;

    return (
      <Modal
        isOpen={true}
        contentLabel={header}
        className="modal"
        overlayClassName="modal-overlay"
        onRequestClose={this.props.onClose}>
        <header className="modal-head">
          <h2>{header}</h2>
        </header>
        <form onSubmit={this.handleSubmit}>
          <div className="modal-body">
            <div className="big-spacer-bottom">
              {translate('branches.detection_of_long_living_branches.description')}
            </div>
            <div className="big-spacer-bottom">
              <input
                autoFocus={true}
                className="input-super-large"
                onChange={this.handleValueChange}
                required={true}
                type="text"
                value={this.state.value}
              />
              {setting.inherited && (
                <div className="note spacer-top">{translate('settings._default')}</div>
              )}
              {!setting.inherited &&
              setting.parentValue && (
                <div className="note spacer-top">
                  {translateWithParameters('settings.default_x', setting.parentValue)}
                </div>
              )}
            </div>
          </div>
          <footer className="modal-foot">
            {!setting.inherited &&
            setting.parentValue && (
              <button className="pull-left" onClick={this.handleResetClick} type="reset">
                {translate('reset_to_default')}
              </button>
            )}
            {this.state.submitting && <i className="spinner spacer-right" />}
            <button disabled={submitDisabled} type="submit">
              {translate('save')}
            </button>
            <a href="#" onClick={this.handleCancelClick}>
              {translate('cancel')}
            </a>
          </footer>
        </form>
      </Modal>
    );
  }
}
