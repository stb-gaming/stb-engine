const esbuild = require("esbuild")

const serve = process.env.ELEVENTY_RUN_MODE === "serve";

const input = "src",
	inputAssets = "assets/**/*.",
	output = "_site",
	outputAssets = output+"/assets/",
	outputImg = outputAssets+"img",
	outputJs = outputAssets+"scripts",
	outputStyles = outputAssets+"styles";
	
module.exports = eleventyConfig => {
eleventyConfig.on("eleventy.before",async () =>{
	await esbuild.build({
		entryPoints:[`${input}/*.js`],
		outdir:outputJs,
		format: "esm",
		bundle: true,
		splitting: true,
		minify: !serve,
		sourcemap: true,
		
	})
})


  eleventyConfig.setPugOptions({ debug: true });
 eleventyConfig.addPassthroughCopy({"assets/**/*.png":outputImg});
 	eleventyConfig.addWatchTarget("src/**/*.js");
 	
   return {
  	dir:{input,output}
  }
};
