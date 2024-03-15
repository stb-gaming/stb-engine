const esbuild = require("esbuild")
const sass = require("sass")
const path = require('path');
const eleventySass = require("eleventy-sass");

const serve = process.env.ELEVENTY_RUN_MODE === "serve";

const input = "src",
	filetype = "/**/*.",
	inputAssets = `assets/${filetype}`,
	output = "_site",
  outputAssets = "assets/",
  outputImg = `${outputAssets}img`,
  outputJs = `${output}/${outputAssets}scripts`,
  outputStyles = `${outputAssets}styles`;
	
module.exports = eleventyConfig => {
 	eleventyConfig.addWatchTarget("src/**/*");
 	eleventyConfig.addWatchTarget("assets/**/*");
eleventyConfig.on("eleventy.before",async () =>{
	await esbuild.build({
		entryPoints:[`${input}/*.js`],
		outdir:`${output}/assets/scripts`,
        format: "esm",
        target:"firefox120",
		bundle: true,
		splitting: true,
		minify: !serve,
		sourcemap: serve,

	})
});

eleventyConfig.addPlugin(eleventySass,{
    compileOptions: {
      // permalink: function(contents, inputPath) {
      //   //return (data) => data.page.filePathStem.replace(/^\/scss\//, "/css/") + ".css";
      //   return (data) => data.page.filePathStem.replace(/^\/scss\//, "/assets/css/") + ".css";
      //
      // }
      permalink:(contents, inputPath)=>data=>data.page.filePathStem.replace(/^\/scss\//, "/assets/css/") + ".css"
    },
    sass: {
      style: "compressed",
      sourceMap: true
    },
    // outdir: outputStyles,
    //rev: true
  });

  eleventyConfig.setPugOptions({ debug: true });
 eleventyConfig.addPassthroughCopy({[`${inputAssets}png`]:outputImg});
 //eleventyConfig.addPassthroughCopy({[`${input}${filetype}css`]:outputStyles});
 	
   return {
  	dir:{input,output}
  }
};
