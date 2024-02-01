// 네트워크 그래프 (graph1)

d3.json("OC0000001_network_data.json").then(graphData1 => {
    const width1 = document.getElementById("graph1").getBoundingClientRect().width;
    const height1 = document.getElementById("graph1").getBoundingClientRect().height;

    const svg1 = d3.select("#graph1")
        .append("svg")
        .attr("width", width1)
        .attr("height", height1);

    const color = d3.scaleOrdinal(d3.schemeCategory10);  // Color scale for node groups


    const simulation1 = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(200))  // Increased distance
        .force("charge", d3.forceManyBody().strength(-200))  // Increased repulsion strength for better spacing
        .force("center", d3.forceCenter(width1 / 2, height1 / 2));

    // For the links (edges)
    const link1 = svg1.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graphData1.links)
        .enter().append("line")
        .attr("stroke-width", 2)
        .attr("stroke", "#e1e1e0");  // Add stroke color for edges
        

    // Add relationship labels on the links
    const linkText1 = svg1.append("g")
        .selectAll(".link-label")
        .data(graphData1.links)
        .enter().append("text")
        .attr("class", "link-label")
        .attr("font-size", "15px")
        .attr("fill", "#000")
        .text(d => d.relation);

    // For the nodes
    const node1 = svg1.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graphData1.nodes)
        .enter().append("circle")
        .attr("r", 10)
        .attr("fill", d => color(d.group));  // Assign color based on node group


    // Add node labels (node name)
    const nodeText1 = svg1.append("g")
        .selectAll(".node-label")
        .data(graphData1.nodes)
        .enter().append("text")
        .attr("class", "node-label")
        .attr("font-size", "15px")
        .attr("fill", "#000")
        .text(d => d.id);

    node1.append("title")
        .text(d => d.id);

    // Adjust the tick function to position the labels
    simulation1.nodes(graphData1.nodes)
        .on("tick", () => {
            link1.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            linkText1.attr("x", d => (d.source.x + d.target.x) / 2)
                    .attr("y", d => (d.source.y + d.target.y) / 2);

            node1.attr("cx", d => d.x)
                .attr("cy", d => d.y);

            nodeText1.attr("x", d => d.x + 15)
                    .attr("y", d => d.y);
        });

    simulation1.force("link")
        .links(graphData1.links);
});



