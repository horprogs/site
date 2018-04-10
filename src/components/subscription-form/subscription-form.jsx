import React from 'react'
import styled, { withTheme } from 'styled-components'
import { compose, lifecycle, withStateHandlers } from 'recompose'
import ym from 'react-yandex-metrika'

import { BrowserOnly, media } from '../../utils/css-utils'
import Button from '../common/button'
import { subscibtionBackground } from '../../utils/selectors'

const SubscriptionFormContainer = styled.section`
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6em 2em;
  ${media.desktop`padding: 10em 2em;`};

  background-size: cover;
  background: #9300ef url(${subscibtionBackground()});
  background-blend-mode: soft-light;
`

const Header = styled.h2`
  text-align: center;
  margin: 0 0 0.615rem;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  color: #fff;
  font-size: 2.6em;
  ${media.tablet`
    font-size: 4.8em;
  `};
`

const SubHeader = styled.p`
  text-align: center;
  margin: 0;
  margin-bottom: 2.86rem; /* 40px */
  font-family: 'Oxygen', sans-serif;
  color: #fff;
  font-size: 1.4em;
  ${media.tablet`
    font-size: 2.4em;
  `};
`

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${media.tablet`
    width: auto;
    flex-direction: row;
  `};
`

const Input = styled.input`
  font-family: 'Oxygen', sans-serif;
  font-size: 2.4em;
  box-sizing: border-box;
  width: 100%;
  padding: 0.83em 1.25em;
  color: #ccc;
  margin-bottom: 1rem; /* 24px */
  ${media.tablet`
    width: 350px;
    margin-right: .625rem; /* 15px */
    margin-bottom: 0;
  `};
`

const FORM_NAME = 'email-subscription'

const SubscriptionForm = ({ theme, hasSubscribed, subscribe }) =>
  !hasSubscribed && (
    <BrowserOnly>
      <SubscriptionFormContainer>
        <Header>Be informed about the coolest meetups</Header>
        <SubHeader>
          Get Webpurples latest news straight to your inbox. Enter your email
          address below:
        </SubHeader>
        <FormWrapper
          name={FORM_NAME}
          method="POST"
          data-netlify="true"
          onSubmit={subscribe}>
          <Input
            type="email"
            required
            placeholder="Enter your email"
            name="email"
          />
          <div data-netlify-recaptcha />
          <Button defaultSheme={'#fff'} hoverColor={theme.vividPurple}>
            Subscribe
          </Button>
        </FormWrapper>
      </SubscriptionFormContainer>
    </BrowserOnly>
  )

const encode = data =>
  Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')

export default compose(
  withStateHandlers(() => ({}), {
    subscribe: () => (_, setStateOnly) => {
      if (!setStateOnly) {
        let form = window.document.forms[FORM_NAME]
        let email = form.elements.email.value

        window
          .fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encode({
              'form-name': FORM_NAME,
              email,
            }),
          })
          .then(() => {
            window.localStorage.setItem(FORM_NAME, 'done')
            alert('Мы вас запомнили! Только рассылку пока не реализовали :-)')
            ym('reachGoal', 'email-subscription')
          })
      }

      return { hasSubscribed: true }
    },
  }),
  lifecycle({
    componentDidMount() {
      if (window.localStorage.getItem(FORM_NAME) === 'done') {
        this.props.subscribe(null, true)
      }
    },
  }),
  withTheme,
)(SubscriptionForm)
