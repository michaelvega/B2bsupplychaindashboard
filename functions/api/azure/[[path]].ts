export async function onRequest(context: any) {
  const { request, env, params } = context;
  
  // 1. Get the secret from Cloudflare
  const sasUrlStr = env.AZURE_SAS_URL;
  if (!sasUrlStr) {
    return new Response(JSON.stringify({ error: "Missing AZURE_SAS_URL secret" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. Parse the base URL from the SAS token
  const sasUrl = new URL(sasUrlStr);
  const sasBase = sasUrl.origin + sasUrl.pathname; 
  
  // 3. Get the incoming path
  const pathParts = params.path || [];
  const relativePath = Array.isArray(pathParts) 
    ? pathParts.map(encodeURIComponent).join('/') 
    : encodeURIComponent(pathParts);

  // 4. Construct the target Azure URL
  let targetUrlStr = sasBase;
  if (relativePath) {
     targetUrlStr += `/${relativePath}`;
  }
  
  const targetUrl = new URL(targetUrlStr);
  const reqUrl = new URL(request.url);
  
  // 5. Append query params
  reqUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });
  sasUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  // --- SPECIAL HANDLING FOR PUT (Write/Edit File) ---
  if (request.method === 'PUT' && reqUrl.searchParams.get('restype') !== 'directory') {
    // Azure requires a 2-step process to save files:
    // Step A: Create File (allocate size)
    // Step B: Put Range (upload data)
    
    // Read the body into memory to get its exact size
    const bodyBuffer = await request.arrayBuffer();
    const length = bodyBuffer.byteLength;

    // Step A: Create File
    const createHeaders = new Headers();
    createHeaders.set('x-ms-type', 'file');
    createHeaders.set('x-ms-content-length', length.toString());
    
    const createRes = await fetch(targetUrl.toString(), {
      method: 'PUT',
      headers: createHeaders
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      return new Response(`Failed to Create File: ${errText}`, { 
        status: createRes.status,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Step B: Put Range (only if there is data to write)
    if (length > 0) {
      const rangeUrl = new URL(targetUrl.toString());
      rangeUrl.searchParams.set('comp', 'range');
      
      const rangeHeaders = new Headers();
      rangeHeaders.set('x-ms-write', 'update');
      rangeHeaders.set('x-ms-range', `bytes=0-${length - 1}`);
      
      const rangeRes = await fetch(rangeUrl.toString(), {
        method: 'PUT',
        headers: rangeHeaders,
        body: bodyBuffer
      });
      
      const newHeaders = new Headers(rangeRes.headers);
      newHeaders.set('Access-Control-Allow-Origin', '*');
      
      return new Response(rangeRes.body, {
        status: rangeRes.status,
        statusText: rangeRes.statusText,
        headers: newHeaders
      });
    }

    // If file is empty, just return the createRes
    const newHeaders = new Headers(createRes.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    return new Response(null, {
      status: createRes.status,
      statusText: createRes.statusText,
      headers: newHeaders
    });
  }

  // --- STANDARD PROXY FOR GET/DELETE/ETC ---
  const response = await fetch(targetUrl.toString(), {
    method: request.method,
    body: request.body
  });

  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*'); 

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
