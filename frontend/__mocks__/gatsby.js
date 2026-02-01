import React from 'react'

export const Link = ({ to, children, ...props }) => (
  <a href={to} {...props}>{children}</a>
)

export const graphql = jest.fn()
export const useStaticQuery = jest.fn()
