import smtplib
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
import os

def send_email_with_attachments(to_email, subject, body, attachments):
    # Read msmtp config for SMTP details
    from_email = "gbot786786@gmail.com"
    
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    
    msg.attach(MIMEText(body, 'plain'))
    
    for file_path in attachments:
        if os.path.exists(file_path):
            with open(file_path, 'rb') as f:
                part = MIMEBase('audio', 'mpeg')
                part.set_payload(f.read())
                encoders.encode_base64(part)
                filename = os.path.basename(file_path)
                part.add_header('Content-Disposition', f'attachment; filename="{filename}"')
                msg.attach(part)
                print(f"Attached: {filename}")
    
    # Use msmtp to send
    import subprocess
    process = subprocess.Popen(['msmtp', '-t'], stdin=subprocess.PIPE)
    process.communicate(msg.as_string().encode())
    return process.returncode == 0

if __name__ == "__main__":
    attachments = [
        '/root/clawd/audio-1-increase-worker-resources.mp3',
        '/root/clawd/audio-2a-provision-yaml-part1.mp3',
        '/root/clawd/audio-2b-provision-yaml-part2.mp3',
        '/root/clawd/audio-3-scaling-worker-node.mp3',
        '/root/clawd/audio-4a-nkp-cli-part1.mp3',
        '/root/clawd/audio-4b-nkp-cli-part2.mp3'
    ]
    
    body = """Hi Andrew,

Please find attached the audio versions of the NKP tutorial scripts:

1. Increase Worker Nodes Compute Resources (1 file)
2. Provision a Kubernetes Cluster Using a YAML File (2 parts)
3. Scaling a Kubernetes Cluster by Adding a Worker Node (1 file)
4. Provisioning a Kubernetes Cluster Using the NKP CLI (2 parts)

Best regards,
G
"""
    
    success = send_email_with_attachments(
        'andrew.pye@nubera.co.uk',
        'NKP Tutorial Audio Files',
        body,
        attachments
    )
    print("Email sent!" if success else "Failed to send")
