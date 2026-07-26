import React from 'react';

const SEO = ({ title, description, path, image = "/Opengraph.png" }) => {
  const siteUrl = "https://www.arjbuilds.dev";
  const canonicalUrl = `${siteUrl}${path}`;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const imageUrl = image.startsWith("http")
    ? image
    : `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`;
  
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${siteUrl}${normalizedPath}`} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${siteUrl}${normalizedPath}`} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content="image/png" />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={`${siteUrl}${normalizedPath}`} />
      <meta name="twitter:image" content={imageUrl} />
    </>
  );
};

export default SEO;
