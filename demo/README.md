# AI Agent Demos Guide

This guide explains how to create, host, and embed interactive demos for AI agents on the marketplace platform.

## 🎯 Overview

Demos are crucial for showcasing your AI agents to potential customers. This guide covers three popular platforms for hosting interactive demos:

1. **Gradio** - Python-based, easy to use, great for ML models
2. **Streamlit** - Full-featured Python apps with advanced UI
3. **HuggingFace Spaces** - Free hosting for Gradio/Streamlit apps

## 🚀 Quick Start

### Option 1: Gradio Demo

Gradio is the fastest way to create a demo for ML models.

**Install Gradio:**
```bash
pip install gradio
```

**Create Demo (`demo.py`):**
```python
import gradio as gr

def agent_function(input_text, param1, param2):
    """Your agent logic here"""
    # Process input
    result = f"Processed: {input_text} with {param1} and {param2}"
    return result

# Create Gradio interface
demo = gr.Interface(
    fn=agent_function,
    inputs=[
        gr.Textbox(label="Input Text", placeholder="Enter your input..."),
        gr.Slider(0, 100, value=50, label="Parameter 1"),
        gr.Dropdown(["Option A", "Option B", "Option C"], label="Parameter 2")
    ],
    outputs=gr.Textbox(label="Output"),
    title="AI Agent Demo",
    description="Try our AI agent with different inputs",
    examples=[
        ["Example 1", 25, "Option A"],
        ["Example 2", 75, "Option B"],
    ]
)

if __name__ == "__main__":
    demo.launch()
```

**Run Locally:**
```bash
python demo.py
# Opens at http://localhost:7860
```

### Option 2: Streamlit Demo

Streamlit provides more flexibility for complex UIs.

**Install Streamlit:**
```bash
pip install streamlit
```

**Create Demo (`app.py`):**
```python
import streamlit as st

st.title("🤖 AI Agent Demo")
st.write("Try our AI agent with your own inputs")

# Input widgets
input_text = st.text_area("Input Text", placeholder="Enter your input...")
param1 = st.slider("Parameter 1", 0, 100, 50)
param2 = st.selectbox("Parameter 2", ["Option A", "Option B", "Option C"])

# Process button
if st.button("Run Agent"):
    with st.spinner("Processing..."):
        # Your agent logic here
        result = f"Processed: {input_text} with {param1} and {param2}"
        
    st.success("Complete!")
    st.write("### Result:")
    st.write(result)

# Sidebar
with st.sidebar:
    st.header("About")
    st.write("This demo showcases our AI agent capabilities.")
    st.write("**Features:**")
    st.write("- Feature 1")
    st.write("- Feature 2")
```

**Run Locally:**
```bash
streamlit run app.py
# Opens at http://localhost:8501
```

### Option 3: HuggingFace Spaces

Host your demo for free on HuggingFace Spaces.

## 🌐 Deploying to HuggingFace Spaces

### Step 1: Create a Space

1. Go to [HuggingFace Spaces](https://huggingface.co/spaces)
2. Click "Create new Space"
3. Choose a name (e.g., `your-username/agent-demo`)
4. Select SDK: Gradio or Streamlit
5. Choose visibility: Public or Private

### Step 2: Prepare Your Files

**For Gradio:**
```
my-agent-demo/
├── app.py              # Your Gradio app
├── requirements.txt    # Python dependencies
└── README.md          # Space description
```

**For Streamlit:**
```
my-agent-demo/
├── app.py              # Your Streamlit app
├── requirements.txt    # Python dependencies
└── README.md          # Space description
```

**requirements.txt example:**
```
gradio==4.8.0
# or
streamlit==1.29.0

# Add your other dependencies
numpy==1.24.3
pandas==2.0.3
torch==2.1.0
transformers==4.35.0
```

### Step 3: Upload to HuggingFace

**Option A: Git (Recommended)**
```bash
# Clone your space
git clone https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
cd YOUR_SPACE_NAME

# Add your files
cp /path/to/app.py .
cp /path/to/requirements.txt .

# Commit and push
git add .
git commit -m "Initial demo"
git push
```

**Option B: Web Upload**
- Use the HuggingFace web interface to upload files directly

### Step 4: Configure Space Settings

In your Space settings:
- Set hardware: CPU (free) or GPU (paid)
- Configure secrets if needed
- Enable/disable automatic rebuilds

## 🔗 Embedding Demos in the Platform

Once your demo is deployed, embed it in the marketplace:

### Update Demo URLs

In `pages/demo/[agent].tsx`, update the `demoUrls` object:

```typescript
const demoUrls: Record<string, string> = {
  'your-agent-id': 'https://huggingface.co/spaces/USERNAME/SPACE_NAME',
};
```

### Iframe Integration

The platform automatically embeds demos using iframes:

```html
<iframe
  src="https://huggingface.co/spaces/USERNAME/SPACE_NAME"
  frameborder="0"
  width="100%"
  height="600px"
></iframe>
```

### Embed Parameters

Add `?embed=true` for better iframe experience:
```
https://huggingface.co/spaces/USERNAME/SPACE_NAME?embed=true
```

## 🎨 Demo Best Practices

### 1. User Experience
- ✅ Clear instructions
- ✅ Example inputs provided
- ✅ Loading indicators
- ✅ Error handling
- ✅ Result visualization

### 2. Performance
- ✅ Fast response times (<5 seconds)
- ✅ Efficient model loading
- ✅ Caching when possible
- ✅ Async processing for long tasks

### 3. Design
- ✅ Clean, professional UI
- ✅ Responsive layout
- ✅ Consistent branding
- ✅ Accessible (WCAG compliant)

### 4. Content
- ✅ Helpful descriptions
- ✅ Multiple examples
- ✅ Clear output formatting
- ✅ Links to documentation

## 🔒 Security Considerations

### Input Validation
```python
def validate_input(text):
    # Limit input length
    if len(text) > 5000:
        raise ValueError("Input too long")
    
    # Sanitize input
    text = text.strip()
    
    return text
```

### Rate Limiting
```python
import time
from collections import defaultdict

# Simple rate limiter
request_counts = defaultdict(list)

def rate_limit(user_ip, max_requests=10, window=60):
    now = time.time()
    requests = request_counts[user_ip]
    
    # Remove old requests
    requests = [t for t in requests if now - t < window]
    
    if len(requests) >= max_requests:
        raise Exception("Rate limit exceeded")
    
    requests.append(now)
    request_counts[user_ip] = requests
```

### API Keys
Never expose API keys in demos. Use Secrets:

**HuggingFace Spaces:**
- Go to Space settings > Repository secrets
- Add your API keys
- Access in code: `os.environ.get('API_KEY')`

## 📊 Analytics

Track demo usage to understand user behavior:

```python
import gradio as gr

def track_usage(input_text, output_text):
    # Log to analytics service
    # Example: Google Analytics, Mixpanel, etc.
    pass

def agent_function(input_text):
    result = process(input_text)
    track_usage(input_text, result)
    return result
```

## 🐛 Debugging

### Local Testing
Always test locally before deploying:
```bash
# Gradio
python app.py

# Streamlit
streamlit run app.py
```

### HuggingFace Logs
Check build and runtime logs in Space settings.

### Common Issues

**Issue: Demo not loading**
- Check requirements.txt
- Verify Python version compatibility
- Check Space logs for errors

**Issue: Slow performance**
- Optimize model loading
- Use smaller models for demo
- Upgrade to GPU hardware

**Issue: Memory errors**
- Reduce batch sizes
- Use model quantization
- Clear cache regularly

## 📚 Resources

- [Gradio Documentation](https://gradio.app/docs/)
- [Streamlit Documentation](https://docs.streamlit.io/)
- [HuggingFace Spaces Docs](https://huggingface.co/docs/hub/spaces)
- [Gradio Examples](https://gradio.app/demos/)
- [Streamlit Gallery](https://streamlit.io/gallery)

## 💡 Advanced Features

### Custom Domain
Point your own domain to HuggingFace Space.

### Authentication
Add authentication to restrict demo access.

### API Mode
Expose demo as API endpoint for programmatic access.

### Webhooks
Send results to external webhooks.

## 🆘 Support

Need help with your demo?
- Check the [documentation](../docs/)
- Join our Discord community
- Email: support@example.com

---

**Last Updated:** 2024-01-01
