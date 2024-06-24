<h1>French Pronunciation Flashcard Generator</h1>
<p>This project consists of two scripts: <code>get_audio.py</code> and <code>create_datafile.py</code>. The first script generates pronunciation audio files for French words using the Coqui TTS (Text-to-Speech) library, and the second script creates a CSV file containing the English and French words, themes, and the base64-encoded pronunciation audio.</p>

<p>It is only used for preparing the data files. It is very compute intensive and there is absolutely no need to compile it more than once. Even so, the compiled file is already present in Backend resources - flashcards.csv</p>
<h2>Requirements</h2>
<ul>
    <li>Python 3.7 or higher</li>
    <li>CUDA-compatible GPU (optional for faster processing)</li>
    <li>NVIDIA drivers (latest version)</li>
    <li>CUDA Toolkit and cuDNN</li>
    <li>Required Python packages: pandas, openpyxl, TTS, torch</li>
</ul>

<h2>Installation</h2>

<h3>Step 1: Set Up Environment</h3>
<ol>
    <li>
        <b>Install Python</b>:<br>
        Download and install Python from <a href="https://www.python.org/downloads/">python.org</a>.
    </li>
    <li>
        <b>Set Up Virtual Environment</b> (optional but recommended):<br>
        <pre><code>python -m venv tts_env
source tts_env/bin/activate  # On Windows: tts_env\Scripts\activate
</code></pre>
</li>
<li>
<b>Install CUDA and cuDNN</b>:<br>
<a href="https://developer.nvidia.com/cuda-downloads">Download and install CUDA</a><br>
<a href="https://developer.nvidia.com/cudnn">Download and install cuDNN</a>
</li>
<li>For cuDNN - it is literally just pasting files into CUDA installation dir</li>
<li>For CUDA to work - set it as System Variable in Path</li>
</ol>

<h2>Step 2: Install Python Dependencies</h2>
- Check this website on what you should run: https://pytorch.org/get-started/locally/
- In addition, probably will need something like the following:
<pre><code>pip install pandas openpyxl TTS torch</code></pre>

<h3>Step 3: Verify GPU Installation</h3>
<p>Ensure your GPU is detected correctly:</p>
<pre><code>nvcc --version</code></pre>
<p>Ensure PyTorch can see the GPU:</p>
<pre><code>import torch
print(torch.cuda.is_available())  # Should return True
</code></pre>

<h3>1. Run: get_audio.py</h3>
- This script generates pronunciation audio files for French words using the Coqui TTS model.
- Check that paths are matching your OS
- It will take long time on bad GPU or without CUDA
- On good GPU it will take some time

<h3>2. Run: create_datafile.py</h3>
- This script reads the pronunciation audio files, encodes them in base64, and creates a CSV file with the English and French words, themes, and the encoded pronunciation audio.
- Check that paths are matching your OS

<h3>3. Copy: created flashcards.csv into backend resource folder</h3>