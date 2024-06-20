from typing import List, Union, Dict, Optional, Any

class ChatMessageRoleEnum:
    System = "system"
    User = "user"
    Assistant = "assistant"
    Function = "function"

class ImageURL:
    """
    Either a URL of the image or the base64 encoded image data.
    
    Specifies the detail level of the image. Learn more in the
    [Vision guide](https://platform.openai.com/docs/guides/vision/low-or-high-fidelity-image-understanding).
    """
    def __init__(self, url: str, detail: Optional[str] = None):
        self.url = url
        self.detail = detail

ContentText = Dict[str, str]
ContentImage = Dict[str, ImageURL]

ChatMessageContent = Union[str, List[Union[ContentText, ContentImage]]]

class Memory(Dict[str, Any]):
    role: str
    content: ChatMessageContent
    name: Optional[str]
    region: Optional[str]
    metadata: Optional[Dict[str, Any]]
    _id: str
    _timestamp: int

InputMemory = Dict[str, Any]

