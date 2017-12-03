We present a d3.js based visualization for 'Corporate Dashboard' for a matrix structured company. The company has verticals/horizontals and BUs (intersection of horizontal and vertical). Choosing a month populates financials in the table and the three walks below. The snapshot gives an overview of all the BUs and their performance month on month.

index.html has the html structure and page1script.js reads the data files Summary and Associate.csv. These two files are parsed and the tables are populated. We have different js files for different tables. We have not used any external libraries except d3.js. The folder bower_components has external code for tooltip in the scatterplot.

Customer level details are shown in the table below with an accompanying scatter plot that shows customer/project level variations.

A demo of the project can be found at this link
https://vipinjose90.github.io/dataviscourse-pr-corporatedashboard/

Click on any month and then choose a Horizontal/Vertical/BUs and see how the walks get updated. Scroll down for the customer list and play around with the scatter plot.

Screencast video is at this link
https://youtu.be/MShgkq-jO38

