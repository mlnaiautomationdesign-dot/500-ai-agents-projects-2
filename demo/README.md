# Demo Hosting Guide

This guide explains how to host and embed AI agent demos in the marketplace.

## Overview

Demos allow users to try your AI agent before purchasing. We support three main platforms for hosting demos:

1. **Gradio** - Best for Python ML models
2. **Streamlit** - Best for Python data apps
3. **Hugging Face Spaces** - Best for sharing with ML community

## Quick Start

### Option 1: Gradio

Gradio is perfect for machine learning demos with a simple Python interface.

**Install Gradio:**
```bash
pip install gradio
```

**Create a demo (`app.py`):**
```python
import gradio as gr

def process_input(text):
    # Your AI agent logic here
    result = f"Processed: {text}"
    return result

demo = gr.Interface(
    fn=process_input,
    inputs=gr.Textbox(label="Input", placeholder="Enter text here..."),
    outputs=gr.Textbox(label="Output"),
    title="My AI Agent Demo",
    description="Try out the agent with sample inputs"
)

if __name__ == "__main__":
    demo.launch(share=True)  # share=True creates public URL
```

**Launch and get public URL:**
```bash
python app.py
```

Gradio will output a public URL like: `https://abc123.gradio.live`

**Add to your agent configuration:**
```typescript
// In pages/demo/[agent].tsx
const DEMO_URLS = {
  'your-agent-id': 'https://abc123.gradio.live',
};
```

### Option 2: Streamlit

Streamlit is great for creating data-focused interactive apps.

**Install Streamlit:**
```bash
pip install streamlit
```

**Create a demo (`app.py`):**
```python
import streamlit as st

st.title("My AI Agent Demo")
st.write("Try out the agent capabilities")

user_input = st.text_input("Enter your input:")

if st.button("Process"):
    # Your AI agent logic here
    result = f"Processed: {user_input}"
    st.success(result)
```

**Deploy to Streamlit Cloud:**

1. Push code to GitHub repository
2. Go to [share.streamlit.io](https://share.streamlit.io)
3. Connect your GitHub repo
4. Deploy app
5. Get public URL: `https://your-app.streamlit.app`

**Add embed parameter for better iframe display:**
```typescript
const DEMO_URLS = {
  'your-agent-id': 'https://your-app.streamlit.app?embed=true',
};
```

### Option 3: Hugging Face Spaces

Hugging Face Spaces provides free hosting for ML demos.

**Create a Space:**

1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click "Create new Space"
3. Choose SDK: Gradio or Streamlit
4. Clone the repository:
```bash
git clone https://huggingface.co/spaces/your-username/your-space
cd your-space
```

**Add your demo files:**
```bash
# For Gradio
echo "gradio" > requirements.txt
# Add your app.py

# For Streamlit  
echo "streamlit" > requirements.txt
# Add your app.py

# Commit and push
git add .
git commit -m "Add demo"
git push
```

**Get the public URL:**
Your Space will be at: `https://your-username-your-space.hf.space`

**Configure in the app:**
```typescript
const DEMO_URLS = {
  'your-agent-id': 'https://your-username-your-space.hf.space',
};
```

## Embedding Best Practices

### 1. Design for iframes

- Keep the UI simple and focused
- Avoid popups or new windows
- Use responsive design
- Test at different viewport sizes

### 2. Performance

- Optimize model loading times
- Cache results when possible
- Show loading indicators
- Set reasonable timeouts

### 3. Demo Data

- Use placeholder/sample data only
- Don't save user inputs
- Add clear disclaimers
- Respect privacy

### 4. User Experience

- Provide clear instructions
- Show example inputs
- Handle errors gracefully
- Keep interactions fast

## iframe Configuration

### Gradio iframes

```html
<iframe 
  src="https://your-demo.gradio.live"
  style="width: 100%; height: 600px; border: none;"
  allow="accelerometer; camera; microphone"
></iframe>
```

### Streamlit iframes

```html
<iframe 
  src="https://your-app.streamlit.app?embed=true"
  style="width: 100%; height: 800px; border: none;"
  allow="accelerometer; camera; microphone"
></iframe>
```

### Hugging Face Spaces iframes

```html
<iframe 
  src="https://your-username-your-space.hf.space"
  style="width: 100%; height: 600px; border: none;"
  allow="accelerometer; camera; microphone"
></iframe>
```

## Local Testing

### Test with ngrok

For local development, use ngrok to create a temporary public URL:

```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com/

# Run your local server
python app.py  # Gradio/Streamlit on port 7860/8501

# In another terminal, expose it
ngrok http 7860  # or 8501 for Streamlit

# Use the ngrok URL in your demo config
```

### Test iframe embedding

Create a simple HTML file to test:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Demo Test</title>
</head>
<body>
    <h1>Test Embedding</h1>
    <iframe 
      src="YOUR_DEMO_URL"
      width="100%"
      height="600"
      frameborder="0"
    ></iframe>
</body>
</html>
```

## Security Considerations

### Sandbox Attributes

The marketplace uses these iframe sandbox settings:

```html
sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
```

This:
- ✅ Allows your demo to function normally
- ✅ Prevents malicious code execution
- ✅ Isolates demo from main site
- ❌ Blocks certain features (for security)

### CORS and CSP

Ensure your demo:
- Sets appropriate CORS headers
- Allows iframe embedding
- Doesn't block cross-origin requests

For Gradio/Streamlit/HF Spaces, this is handled automatically.

## Troubleshooting

### Demo not loading in iframe

**Problem:** Blank iframe or error message

**Solutions:**
1. Check if demo URL is accessible
2. Verify X-Frame-Options headers allow embedding
3. Test demo URL directly in browser
4. Check browser console for errors

### Demo too slow

**Solutions:**
1. Optimize model loading
2. Use smaller models for demos
3. Add loading indicators
4. Cache responses
5. Consider edge deployment

### Layout issues in iframe

**Solutions:**
1. Use responsive design
2. Test at different viewport sizes
3. Avoid fixed pixel widths
4. Use Streamlit's `?embed=true` parameter
5. Set appropriate iframe height

## Examples

### Simple Text Processing (Gradio)

```python
import gradio as gr

def analyze_text(text):
    word_count = len(text.split())
    char_count = len(text)
    return f"Words: {word_count}, Characters: {char_count}"

gr.Interface(
    fn=analyze_text,
    inputs=gr.Textbox(lines=5, label="Text"),
    outputs=gr.Textbox(label="Analysis"),
    title="Text Analyzer Demo"
).launch(share=True)
```

### Interactive Chat (Streamlit)

```python
import streamlit as st

st.title("AI Chatbot Demo")

if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"])

if prompt := st.chat_input("Say something"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)
    
    # AI response
    response = f"Echo: {prompt}"
    st.session_state.messages.append({"role": "assistant", "content": response})
    with st.chat_message("assistant"):
        st.write(response)
```

## Resources

- [Gradio Documentation](https://gradio.app/docs/)
- [Streamlit Documentation](https://docs.streamlit.io/)
- [Hugging Face Spaces Guide](https://huggingface.co/docs/hub/spaces)
- [ngrok Documentation](https://ngrok.com/docs)

## Support

Need help with demo hosting?
- Check examples in existing agent demos
- Review platform documentation
- Contact support at support@example.com
