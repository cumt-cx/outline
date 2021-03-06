// @flow
import * as React from 'react';
import Notice from '../../../shared/components/Notice';

type Props = {
  notice?: string,
};

export default function AuthErrors({ notice }: Props) {
  return (
    <React.Fragment>
      {notice === 'google-hd' && (
        <Notice>
          Sorry, Google sign in cannot be used with a personal email. Please try
          signing in with your company Google account.
        </Notice>
      )}
      {notice === 'hd-not-allowed' && (
        <Notice>
          Sorry, your Google apps domain is not allowed. Please try again with
          an allowed company domain.
        </Notice>
      )}
      {notice === 'auth-error' && (
        <Notice>
          认证失败 - 暂时出了点问题，无法认证你的身份，请稍候再试一下。
        </Notice>
      )}
    </React.Fragment>
  );
}
