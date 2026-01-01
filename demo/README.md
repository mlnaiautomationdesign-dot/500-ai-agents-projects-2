# Demo Hosting Guide

This guide explains how to host and embed AI agent demos on various platforms including Gradio, Streamlit, and Hugging Face Spaces.

## 🎯 Overview

Live demos are essential for showcasing your AI agents. Users can interact with agents before making a purchase decision. This guide covers hosting demos on popular platforms and embedding them in your Next.js application.

## 🚀 Hosting Options

### Option 1: Hugging Face Spaces (Recommended)

Hugging Face Spaces is the easiest way to host AI demos with built-in GPU support.

#### Steps:

1. **Create a Space**
   - Go to https://huggingface.co/new-space
   - Choose between Gradio or Streamlit SDK
   - Select hardware (CPU or GPU)

2. **Add Your Code**
   ```python
   # app.py for Gradio
   import gradio as gr
   
   def predict(input_text):
       # Your AI agent logic here
       result = your_agent_function(input_text)
       return result
   
   demo = gr.Interface(
       fn=predict,
       inputs=gr.Textbox(label="Input"),
       outputs=gr.Textbox(label="Output"),
       title="AI Agent Demo",
       description="Try our AI agent"
   )
   
   if __name__ == "__main__":
       demo.launch()
   ```

3. **Deploy**
   - Commit and push your code
   - Space will automatically deploy
   - Get your embed URL: `https://username-spacename.hf.space`

4. **Embed in Next.js**
   - Update `pages/demo/[agent].tsx`
   - Add your Space URL to the `embedUrl` field:
   ```typescript
   embedUrl: "https://your-username-your-space.hf.space?embed=true"
   ```

### Option 2: Streamlit Cloud

Great for data-centric demos with interactive visualizations.

#### Steps:

1. **Create Streamlit App**
   ```python
   # streamlit_app.py
   import streamlit as st
   
   st.title("AI Agent Demo")
   
   user_input = st.text_area("Enter your input:")
   
   if st.button("Run"):
       # Your AI agent logic
       result = your_agent_function(user_input)
       st.write(result)
   ```

2. **Deploy to Streamlit Cloud**
   - Push code to GitHub
   - Go to https://share.streamlit.io/
   - Connect your GitHub repo
   - Deploy

3. **Get Embed URL**
   - URL format: `https://share.streamlit.io/username/repo/main/streamlit_app.py`
   - Add `?embed=true` for embedding

### Option 3: Gradio on Your Server

Self-host Gradio for full control.

#### Steps:

1. **Install Gradio**
   ```bash
   pip install gradio
   ```

2. **Create Demo**
   ```python
   import gradio as gr
   
   def agent_function(input_text):
       # Your logic
       return output
   
   demo = gr.Interface(
       fn=agent_function,
       inputs="text",
       outputs="text",
       examples=[
           ["Example 1"],
           ["Example 2"]
       ]
   )
   
   demo.launch(server_name="0.0.0.0", server_port=7860, share=False)
   ```

3. **Deploy with Docker**
   ```dockerfile
   FROM python:3.9
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY app.py .
   EXPOSE 7860
   CMD ["python", "app.py"]
   ```

4. **Set Up Reverse Proxy**
   Use Nginx or Caddy to serve over HTTPS

### Option 4: Custom Next.js API Route

For simple demos, create a custom API endpoint.

```typescript
// pages/api/demo/[agent].ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { agent } = req.query;
  const { input } = req.body;
  
  // Call your AI agent
  const result = await runAgent(agent as string, input);
  
  res.status(200).json({ result });
}
```

Then create a React component for the demo interface.

## 📦 Demo Requirements

### Required Files

For Hugging Face Spaces:
```
space/
├── app.py (or streamlit_app.py)
├── requirements.txt
└── README.md
```

### requirements.txt Example
```
gradio==4.0.0
transformers==4.35.0
torch==2.1.0
# Add your dependencies
```

### README.md for Spaces
```markdown
---
title: AI Agent Demo
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: gradio
sdk_version: 4.0.0
app_file: app.py
pinned: false
---

# AI Agent Demo

Description of your agent and how to use it.
```

## 🎨 Styling Your Demos

### Gradio Custom Theme

```python
import gradio as gr

theme = gr.themes.Soft(
    primary_hue="blue",
    secondary_hue="purple",
)

demo = gr.Interface(
    fn=predict,
    inputs=...,
    outputs=...,
    theme=theme
)
```

### Streamlit Custom CSS

```python
st.markdown("""
<style>
    .main {
        background-color: #f0f2f6;
    }
    .stButton>button {
        background-color: #4CAF50;
        color: white;
    }
</style>
""", unsafe_allow_html=True)
```

## 🔐 Security Considerations

1. **Rate Limiting**: Implement rate limits on your demos
2. **Input Validation**: Sanitize user inputs
3. **API Keys**: Use environment variables for secrets
4. **Content Filtering**: Filter inappropriate content
5. **Cost Controls**: Set usage limits to control API costs

### Example Rate Limiting (Gradio)

```python
import time
from functools import wraps

def rate_limit(max_calls=10, time_window=60):
    calls = []
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            now = time.time()
            calls[:] = [c for c in calls if c > now - time_window]
            if len(calls) >= max_calls:
                raise gr.Error("Rate limit exceeded. Please try again later.")
            calls.append(now)
            return func(*args, **kwargs)
        return wrapper
    return decorator

@rate_limit(max_calls=5, time_window=60)
def predict(input_text):
    return your_agent_function(input_text)
```

## 🔗 Embedding Demos

### Update Demo Config

In `pages/demo/[agent].tsx`, update the `demoConfig`:

```typescript
const demoConfig: Record<string, { title: string; description: string; embedUrl?: string }> = {
  "your-agent-id": {
    title: "Your Agent Name",
    description: "Description of your agent",
    embedUrl: "https://your-demo-url.hf.space?embed=true",
  },
};
```

### Iframe Parameters

Common parameters for embedding:
- `?embed=true` - Enable embed mode
- `?__theme=light` or `?__theme=dark` - Set theme
- `?show_share_button=false` - Hide share button
- `?show_footer=false` - Hide footer

Example:
```
https://your-space.hf.space?embed=true&__theme=light&show_share_button=false
```

## 📊 Monitoring Demos

Track demo usage:
1. Add analytics to your Gradio/Streamlit apps
2. Monitor Space usage in Hugging Face dashboard
3. Set up alerts for high usage or errors
4. Collect user feedback

## 🐛 Troubleshooting

### Common Issues

**Demo not loading:**
- Check if Space is running
- Verify embed URL is correct
- Check CORS settings
- Ensure Space has enough resources

**Slow performance:**
- Upgrade to GPU hardware
- Optimize model inference
- Add caching
- Reduce model size

**iframe blocked:**
- Check X-Frame-Options headers
- Verify CSP policies
- Use proper embed parameters

## 📚 Additional Resources

- [Gradio Documentation](https://gradio.app/docs/)
- [Streamlit Documentation](https://docs.streamlit.io/)
- [Hugging Face Spaces Guide](https://huggingface.co/docs/hub/spaces)
- [Next.js iframe embedding](https://nextjs.org/docs/api-reference/next/image)

## 💬 Support

Need help hosting your demo?
- Email: demos@aiagents.com
- Slack: #demo-support
- GitHub: Open an issue

---

*Last updated: 2024*
