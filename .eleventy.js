module.exports = function(eleventyConfig) {
  // Pass through assets
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/icons");
  eleventyConfig.addPassthroughCopy("src/assets/js");

  // Watch for CSS changes
  eleventyConfig.addWatchTarget("src/assets/css/");

  // Filter to get companies by trade
  eleventyConfig.addFilter("filterByTrade", function(companies, trade) {
    return companies.filter(c => c.trade.toLowerCase() === trade.toLowerCase());
  });

  // Filter to get company by slug
  eleventyConfig.addFilter("getCompanyBySlug", function(companies, slug) {
    return companies.find(c => c.slug === slug);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
