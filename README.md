# Analysis of WorldBank Maternal Mortality Data

This repository forms an analysis and visualization I conducted of World Bank's
maternal mortality indicator (showing estimates of maternal mortality per capita
rates across the world). 

I used a variety of command-line tools to conduct exploratory analysis
for this project before running a more formal analysis in Python
(using `altair`, and `pandas`).

I then visualized my findings using `react` and `d3`.

## Setup/Replication

### Python Analysis

In order to replicate my analysis, you will first need to download
the data from [WorldBank's gender data portal](http://datatopics.worldbank.org/gender/).
In order to do this, I selected "Maternal mortality ratio (modeled estimate, per 100,000 live births)"
under the "Find an Indicator" section, clicked "Go", clicked the "Download options"
selection on the next page, and selected "CSV". After downloading the CSV,
I unzipped the downloaded file and moved the two CSV files into the `data/`
folder within this repository. I also renamed the metadata file
"worldbank-metadata.csv" and renamed the data file "worldbank-data.csv".

After downloading the data and moving (and renaming) the files into the `data/`
directory, you need to install the Python dependencies I used. (These
dependencies are just `altair` and `pandas`.) The simplest
way to do this is by running:

```bash
pipenv install
```

within this repository. From there, you can run the single Python Notebook
inside the `analysis` directory (assuming you have Jupyter installed and
are using a kernel with access to `pandas` and `altair`).
(In order to set up a kernel within a virtual environment, follow
the steps offered [in this guide](https://anbasile.github.io/posts/2017-06-25-jupyter-venv/).)
 
### Visualization

In order to view the visualization, type:

```bash
cd gender-data
npm install
npm start
```
