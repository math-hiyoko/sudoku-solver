import React from 'react';
import { Link } from 'gatsby';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>404: Not Found</h1>
      <p>{t('page_not_found')}</p>
      <Link to="/">{t('back_to_home')}</Link>
    </div>
  );
};

export default NotFoundPage;
