# content-auth.js
## Functions

<dl>
<dt><a href="#content-auth">content-auth(info)</a> ⇒ <code>string</code></dt>
<dd><p>Used for Checking the <code>info.userId</code> wether is owned <code>info.dataId</code> or not.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#infoObject">infoObject</a></dt>
<dd></dd>
</dl>

<a name="content-auth"></a>

## content-auth(info) ⇒ <code>string</code>
Used for Checking the `info.userId` wether is owned `info.dataId` or not.

**Kind**: global function  
**Throws**:

- `dataId` is `NaN`
- `userId` is `NaN`
- data fetch failed


| Param | Type |
| --- | --- |
| info | [<code>infoObject</code>](#infoObject) | 

<a name="infoObject"></a>

## infoObject
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| userId, | <code>string</code> \| <code>number</code> | 
| dataId | <code>string</code> \| <code>number</code> | 
