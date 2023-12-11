// 네트워크 그래프 (graph1)

d3.json("OG0003138_network_data.json").then(graphData1 => {
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

// 트리 그래프 (graph2)

d3.json("OG0003138_tree_data.json").then(graphData2 => {
    const width2 = document.getElementById("graph2").getBoundingClientRect().width;
    const height2 = document.getElementById("graph2").getBoundingClientRect().height;

    const svg2 = d3.select("#graph2")
        .append("svg")
        .attr("width", width2)
        .attr("height", height2)
        .append("g")
        .attr("transform", `translate(100, 100)`);  // Slight translation for padding

    const treeLayout = d3.tree()
        .size([height2 - 200, width2 - 300]); // Adjust size to fit within div
          
    const root2 = d3.hierarchy(graphData2);
    treeLayout(root2);

    const link2 = svg2.selectAll(".link")
        .data(root2.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()   // Use linkVertical instead of linkHorizontal
            .x(d => d.y)
            .y(d => d.x))
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-width", "1.5px");

    const node2 = svg2.selectAll(".node")
        .data(root2.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    node2.append("circle")
        .attr("r", 6);

    node2.append("text")
        .attr("font-size", "15px")
        .attr("dy", d => d.children ? -20 : -20) // Adjust the dy value based on whether the node has children
        .attr("dx", 3)
        .attr("text-anchor", "middle")
        .text(d => d.data.data.id);
    
    
});

