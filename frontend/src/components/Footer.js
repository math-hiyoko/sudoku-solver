import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #f1f1f1;
  padding: 10px 0;
  text-align: center;
  width: 100%;
  font-size: 0.9em;
  color: #555;
  margin-top: auto; /* フッターを最下部に配置 */
`;

const Footer = () => (
  <FooterContainer>
    © 2024 KOKI Watanabe. All rights reserved.
  </FooterContainer>
);

export default Footer;
