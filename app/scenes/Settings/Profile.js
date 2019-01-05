// @flow
import * as React from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';

import AuthStore from 'stores/AuthStore';
import UiStore from 'stores/UiStore';
import ImageUpload from './components/ImageUpload';
import Input, { LabelText } from 'components/Input';
import Button from 'components/Button';
import CenteredContent from 'components/CenteredContent';
import PageTitle from 'components/PageTitle';
import UserDelete from 'scenes/UserDelete';
import Flex from 'shared/components/Flex';

type Props = {
  auth: AuthStore,
  ui: UiStore,
};

@observer
class Profile extends React.Component<Props> {
  timeout: TimeoutID;
  form: ?HTMLFormElement;

  @observable name: string;
  @observable avatarUrl: ?string;
  @observable showDeleteModal: boolean = false;

  componentDidMount() {
    if (this.props.auth.user) {
      this.name = this.props.auth.user.name;
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleSubmit = async (ev: SyntheticEvent<*>) => {
    ev.preventDefault();

    await this.props.auth.updateUser({
      name: this.name,
      avatarUrl: this.avatarUrl,
    });
    this.props.ui.showToast('Profile saved', 'success');
  };

  handleNameChange = (ev: SyntheticInputEvent<*>) => {
    this.name = ev.target.value;
  };

  handleAvatarUpload = async (avatarUrl: string) => {
    this.avatarUrl = avatarUrl;

    await this.props.auth.updateUser({
      avatarUrl: this.avatarUrl,
    });
    this.props.ui.showToast('Profile picture updated', 'success');
  };

  handleAvatarError = (error: ?string) => {
    this.props.ui.showToast(error || 'Unable to upload new avatar');
  };

  toggleDeleteAccount = () => {
    this.showDeleteModal = !this.showDeleteModal;
  };

  get isValid() {
    return this.form && this.form.checkValidity();
  }

  render() {
    const { user, isSaving } = this.props.auth;
    if (!user) return null;
    const avatarUrl = this.avatarUrl || user.avatarUrl;

    return (
      <CenteredContent>
        <PageTitle title="Profile" />
        <h1>我的资料</h1>
        <ProfilePicture column>
          <LabelText>头像</LabelText>
          <AvatarContainer>
            <ImageUpload
              onSuccess={this.handleAvatarUpload}
              onError={this.handleAvatarError}
            >
              <Avatar src={avatarUrl} />
              <Flex auto align="center" justify="center">
                上传
              </Flex>
            </ImageUpload>
          </AvatarContainer>
        </ProfilePicture>
        <form onSubmit={this.handleSubmit} ref={ref => (this.form = ref)}>
          <Input
            label="Name"
            value={this.name}
            onChange={this.handleNameChange}
            required
            short
          />
          <Button type="submit" disabled={isSaving || !this.isValid}>
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </form>

        <DangerZone>
          <LabelText>删除账户</LabelText>
          <p>
            你随时都可以删除账户，但是请注意删除之后无法恢复。{' '}
            <a onClick={this.toggleDeleteAccount}>删除账户</a>
          </p>
        </DangerZone>
        {this.showDeleteModal && (
          <UserDelete onRequestClose={this.toggleDeleteAccount} />
        )}
      </CenteredContent>
    );
  }
}

const DangerZone = styled.div`
  background: #fff;
  position: absolute;
  bottom: 16px;
`;

const ProfilePicture = styled(Flex)`
  margin-bottom: 24px;
`;

const avatarStyles = `
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const AvatarContainer = styled(Flex)`
  ${avatarStyles};
  position: relative;

  div div {
    ${avatarStyles};
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
    transition: all 250ms;
  }

  &:hover div {
    opacity: 1;
    background: rgba(0, 0, 0, 0.75);
    color: ${props => props.theme.white};
  }
`;

const Avatar = styled.img`
  ${avatarStyles};
`;

export default inject('auth', 'ui')(Profile);
