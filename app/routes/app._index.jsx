import React, { useEffect, useState } from "react";

export default function App() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  // 🔹 Load locations
  useEffect(() => {
    async function getLocations() {
      const res = await fetch("/api/locations");
      const data = await res.json();

      setLocations(data.locations || []);
      if (data.locations?.length > 0) {
        setSelectedLocation(data.locations[0].id);
      }
    }
    getLocations();
  }, []);

  // 🔹 Search function
  async function handleSearch() {
    if (!query || !selectedLocation) return;

    const res = await fetch(
      `/api/search?q=${encodeURIComponent(query)}&location=${selectedLocation}`
    );
    const data = await res.json();

    setProducts(data.products || []);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Inventory Scanner</h2>

      {/* LOCATION */}
      <div style={{ marginBottom: 10 }}>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search title / SKU / barcode"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, width: 300 }}
        />
        <button onClick={handleSearch} style={{ marginLeft: 10 }}>
          Search
        </button>
      </div>

      {/* RESULTS */}
      <div>
        {products.length === 0 ? (
          <p>No products</p>
        ) : (
          products.map((product) => (
            <div key={product.id} style={{ marginBottom: 20 }}>
              <h3>{product.title}</h3>

              <table border="1" cellPadding="5">
                <thead>
                  <tr>
                    <th>Variant</th>
                    <th>SKU</th>
                    <th>Barcode</th>
                    <th>Inventory</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v) => (
                    <tr key={v.id}>
                      <td>{v.title}</td>
                      <td>{v.sku}</td>
                      <td>{v.barcode}</td>
                      <td>{v.inventory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}