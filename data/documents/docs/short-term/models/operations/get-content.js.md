# get-content
## Functions

<dl>
<dt><a href="#getContent">getContent(aspect, keypoint, method, dataId, isChecked, isConflicted)</a> ⇒ <code><a href="#ContentInfo">Array.&lt;ContentInfo&gt;</a></code></dt>
<dd><p>Return all the content given the specific condition</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ContentInfo">ContentInfo</a></dt>
<dd></dd>
</dl>

<a name="getContent"></a>

## getContent(aspect, keypoint, method, dataId, isChecked, isConflicted) ⇒ [<code>Array.&lt;ContentInfo&gt;</code>](#ContentInfo)
Return all the content given the specific condition

**Kind**: global function  
**Throws**:

- - throw a


| Param | Type |
| --- | --- |
| aspect | <code>number</code> | 
| keypoint | <code>number</code> | 
| method | <code>number</code> | 
| dataId | <code>number</code> | 
| isChecked | <code>number</code> | 
| isConflicted | <code>number</code> | 

<a name="ContentInfo"></a>

## ContentInfo
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| updateTime | <code>string</code> | 
| title1 | <code>string</code> | 
| title2 | <code>string</code> | 
| title3 | <code>string</code> | 
| title4 | <code>string</code> | 
| content | <code>string</code> | 
| summary | <code>string</code> | 
| note | <code>string</code> | 
| isChecked | <code>number</code> | 
| isConflicted | <code>number</code> | 
| contentId | <code>number</code> | 
| pageFrom | <code>number</code> | 
| pageTo | <code>number</code> | 
| aspect | <code>number</code> | 
| keypoint | <code>number</code> | 
| method | <code>number</code> | 
| conflictedAspect | <code>number</code> | 
| conflictedKeypoint | <code>number</code> | 
| conflictedMethod | <code>number</code> | 
| reviewerId | <code>number</code> | 