# content-update.js
## Functions

<dl>
<dt><a href="#content-update">content-update(contentId, updateData)</a> ⇒ <code>object</code></dt>
<dd><p>update a content with the given <code>userId</code>, <code>contentId</code>.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#infoObject">infoObject</a></dt>
<dd></dd>
</dl>

<a name="content-update"></a>

## content-update(contentId, updateData) ⇒ <code>object</code>
update a content with the given `userId`, `contentId`.

**Kind**: global function  
**Throws**:

- invalide argument
- `contentId`is `NaN`
- `pageFrom` is `NaN`
- `pageTo` is `NaN`
- data fetch failed


| Param | Type |
| --- | --- |
| contentId | <code>number</code> | 
| updateData | [<code>infoObject</code>](#infoObject) | 

<a name="infoObject"></a>

## infoObject
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| contentId | <code>number</code> | 
| userId | <code>number</code> | 
| pageFrom | <code>number</code> | 
| pageTo | <code>nummber</code> | 
| title1 | <code>string</code> | 
| title2 | <code>string</code> | 
| title3 | <code>string</code> | 
| title4 | <code>string</code> | 
| content | <code>string</code> | 
| summary | <code>string</code> | 
| note | <code>string</code> | 
| reviewerId | <code>number</code> | 
