import React from "react";
import { Link } from "gatsby";
import Layout from "../components/Layout";
import { Button } from "../styles/CommonStyles";

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Button>
        <Link to="/">Go to Home</Link>
      </Button>
    </Layout>
  );
};

export default NotFoundPage;
